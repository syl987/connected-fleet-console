import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleLog } from '../entities/vehicle-log.entity';

@Injectable()
export class VehicleLogsAnalyticsService {
  constructor(@InjectRepository(VehicleLog) private readonly vehicleLogsRepository: Repository<VehicleLog>) {}

  async getSummary() {
    const totalLogs = await this.vehicleLogsRepository.count();

    const uniqueVehicles = await this.vehicleLogsRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.vehicleId)', 'count')
      .getRawOne()
      .then(({ count }) => parseInt(count));

    const uniqueCodes = await this.vehicleLogsRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.code)', 'count')
      .getRawOne()
      .then(({ count }) => parseInt(count));

    const { earliest, latest } = await this.vehicleLogsRepository
      .createQueryBuilder('log')
      .select('MIN(log.timestamp)', 'earliest')
      .addSelect('MAX(log.timestamp)', 'latest')
      .getRawOne();

    return {
      totalLogs,
      uniqueVehicles,
      uniqueCodes,
      dateRange: { earliest, latest },
    };
  }

  async getSeverityDistribution(from?: Date, to?: Date, vehicleId?: number) {
    let query = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .select('log.severity', 'severity')
      .addSelect('COUNT(*)', 'count');

    if (from) query = query.andWhere('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });
    if (vehicleId) query = query.andWhere('log.vehicleId = :vehicleId', { vehicleId });

    const results = await query.groupBy('log.severity').getRawMany();

    const total = results.reduce((sum, row) => sum + parseInt(row.count), 0);

    return results.map((row) => ({
      severity: row.severity,
      count: parseInt(row.count),
      percentage: total > 0 ? (parseInt(row.count) / total) * 100 : 0,
    }));
  }

  async getTopErrors(limit: number, severity?: string, from?: Date, to?: Date) {
    let query = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .select('log.code', 'code')
      .addSelect('log.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .addSelect('MAX(log.timestamp)', 'lastOccurrence')
      .addSelect('COUNT(DISTINCT log.vehicleId)', 'affectedVehicles');

    if (severity) query = query.where('log.severity = :severity', { severity });
    if (from) query = query.andWhere('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });

    const results = await query
      .groupBy('log.code')
      .addGroupBy('log.severity')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((row) => ({
      code: parseInt(row.code),
      count: parseInt(row.count),
      severity: row.severity,
      lastOccurrence: row.lastOccurrence,
      affectedVehicles: parseInt(row.affectedVehicles),
    }));
  }

  async getVehicleHealth(from?: Date, to?: Date) {
    let query = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .select('vehicle.id', 'vehicleId')
      .addSelect('vehicle.brand', 'brand')
      .addSelect('vehicle.model', 'model')
      .addSelect('vehicle.vin', 'vin')
      .addSelect('COUNT(*)', 'totalLogs')
      .addSelect("SUM(CASE WHEN log.severity = 'CRITICAL' THEN 1 ELSE 0 END)", 'criticalCount')
      .addSelect("SUM(CASE WHEN log.severity = 'ERROR' THEN 1 ELSE 0 END)", 'errorCount')
      .addSelect("SUM(CASE WHEN log.severity = 'WARNING' THEN 1 ELSE 0 END)", 'warningCount')
      .addSelect('MAX(log.timestamp)', 'lastLogTimestamp');

    if (from) query = query.where('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });

    const results = await query.groupBy('vehicle.id').getRawMany();

    return results.map((row) => {
      const totalLogs = parseInt(row.totalLogs);
      const criticalCount = parseInt(row.criticalCount || 0);
      const errorCount = parseInt(row.errorCount || 0);
      const warningCount = parseInt(row.warningCount || 0);

      // Simple health score: 100 - weighted severity penalties
      const healthScore = Math.max(
        0,
        100 - (criticalCount * 10 + errorCount * 5 + warningCount * 2) / Math.max(totalLogs, 1),
      );

      let status: string;
      if (criticalCount > 0 || healthScore < 50) {
        status = 'critical';
      } else if (errorCount > 0 || healthScore < 75) {
        status = 'warning';
      } else {
        status = 'healthy';
      }

      return {
        vehicleId: row.vehicleId,
        vehicleName: `${row.brand} ${row.model}`,
        vin: row.vin,
        totalLogs,
        criticalCount,
        errorCount,
        warningCount,
        healthScore: Math.round(healthScore * 10) / 10,
        status,
        lastLogTimestamp: row.lastLogTimestamp,
      };
    });
  }

  async getAggregations(groupBy: string, limit: number, from?: Date, to?: Date) {
    let query = this.vehicleLogsRepository.createQueryBuilder('log');

    if (from) query = query.where('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });

    let selectField: string;
    let groupField: string;

    switch (groupBy) {
      case 'severity':
        selectField = 'log.severity';
        groupField = 'log.severity';
        break;
      case 'code':
        selectField = 'log.code';
        groupField = 'log.code';
        break;
      case 'vehicle':
        query = query.leftJoin('log.vehicle', 'vehicle');
        selectField = "vehicle.brand || ' ' || vehicle.model";
        groupField = 'log.vehicleId';
        break;
      case 'hour':
        selectField = "strftime('%H:00', log.timestamp)";
        groupField = "strftime('%H', log.timestamp)";
        break;
      case 'day':
        selectField = "strftime('%Y-%m-%d', log.timestamp)";
        groupField = "strftime('%Y-%m-%d', log.timestamp)";
        break;
      case 'month':
        selectField = "strftime('%Y-%m', log.timestamp)";
        groupField = "strftime('%Y-%m', log.timestamp)";
        break;
      default:
        throw new Error(`Invalid groupBy value: ${groupBy}`);
    }

    const results = await query
      .select(selectField, 'key')
      .addSelect('COUNT(*)', 'count')
      .groupBy(groupField)
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    const total = results.reduce((sum, row) => sum + parseInt(row.count), 0);

    return results.map((row) => ({
      key: row.key,
      count: parseInt(row.count),
      percentage: total > 0 ? (parseInt(row.count) / total) * 100 : 0,
    }));
  }
}
