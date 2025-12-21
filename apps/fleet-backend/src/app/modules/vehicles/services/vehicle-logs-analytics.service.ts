import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleLogsAnalyticsService {
  constructor(
    @InjectRepository(VehicleLog) private readonly logsRepository: Repository<VehicleLog>,
    @InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  async getSummary() {
    const [totalLogs, uniqueVehicles, uniqueCodes] = await Promise.all([
      this.logsRepository.count(),
      this.logsRepository
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.vehicleId)', 'count')
        .getRawOne()
        .then((r) => parseInt(r.count)),
      this.logsRepository
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.code)', 'count')
        .getRawOne()
        .then((r) => parseInt(r.count)),
    ]);

    const severityCounts = await this.logsRepository
      .createQueryBuilder('log')
      .select('log.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.severity')
      .getRawMany();

    const bySeverity = severityCounts.reduce(
      (acc, row) => {
        acc[row.severity] = parseInt(row.count);
        return acc;
      },
      {} as Record<string, number>,
    );

    const dateRange = await this.logsRepository
      .createQueryBuilder('log')
      .select('MIN(log.timestamp)', 'earliest')
      .addSelect('MAX(log.timestamp)', 'latest')
      .getRawOne();

    return {
      totalLogs,
      bySeverity,
      uniqueVehicles,
      uniqueCodes,
      dateRange: {
        earliest: dateRange.earliest,
        latest: dateRange.latest,
      },
    };
  }

  async getSeverityDistribution(from?: Date, to?: Date, vehicleId?: number) {
    let query = this.logsRepository
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
    let query = this.logsRepository
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

  async getTimeline(groupBy: string, from?: Date, to?: Date, severity?: string, vehicleId?: number) {
    let dateFormat: string;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'day':
      default:
        dateFormat = '%Y-%m-%d';
        break;
    }

    let query = this.logsRepository
      .createQueryBuilder('log')
      .select(`strftime('${dateFormat}', log.timestamp)`, 'period')
      .addSelect('log.severity', 'severity')
      .addSelect('COUNT(*)', 'count');

    if (from) query = query.where('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });
    if (severity) query = query.andWhere('log.severity = :severity', { severity });
    if (vehicleId) query = query.andWhere('log.vehicleId = :vehicleId', { vehicleId });

    const results = await query.groupBy('period').addGroupBy('log.severity').orderBy('period', 'ASC').getRawMany();

    // Group by period
    const grouped = results.reduce(
      (acc, row) => {
        const period = row.period;
        if (!acc[period]) {
          acc[period] = { period, count: 0, bySeverity: {} };
        }
        const count = parseInt(row.count);
        acc[period].count += count;
        acc[period].bySeverity[row.severity] = count;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(grouped);
  }

  async getVehicleHealth(from?: Date, to?: Date) {
    let query = this.logsRepository
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

  async getCodePatterns(code?: number, from?: Date, to?: Date) {
    if (!code) {
      // If no specific code, return most common code
      const topCode = await this.logsRepository
        .createQueryBuilder('log')
        .select('log.code', 'code')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.code')
        .orderBy('count', 'DESC')
        .limit(1)
        .getRawOne();

      if (!topCode) {
        return { message: 'No logs found' };
      }
      code = parseInt(topCode.code);
    }

    let query = this.logsRepository.createQueryBuilder('log').where('log.code = :code', { code });

    if (from) query = query.andWhere('log.timestamp >= :from', { from });
    if (to) query = query.andWhere('log.timestamp <= :to', { to });

    const [totalOccurrences, logs] = await Promise.all([
      query.getCount(),
      query.orderBy('log.timestamp', 'ASC').getMany(),
    ]);

    // Find correlated codes (codes that appear in same vehicles)
    const vehicleIds = [...new Set(logs.map((log) => log.vehicle?.id).filter(Boolean))];
    const correlatedCodes = await this.logsRepository
      .createQueryBuilder('log')
      .select('log.code', 'code')
      .addSelect('COUNT(*)', 'count')
      .where('log.vehicleId IN (:...vehicleIds)', { vehicleIds })
      .andWhere('log.code != :code', { code })
      .groupBy('log.code')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    // Calculate average time between occurrences
    let avgTimeBetween = 0;
    if (logs.length > 1) {
      const timeDiffs = [];
      for (let i = 1; i < logs.length; i++) {
        const diff = logs[i].timestamp.getTime() - logs[i - 1].timestamp.getTime();
        timeDiffs.push(diff);
      }
      avgTimeBetween = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    }

    // Peak hours analysis
    const hourCounts = logs.reduce(
      (acc, log) => {
        const hour = log.timestamp.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const peakHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      code,
      totalOccurrences,
      correlatedCodes: correlatedCodes.map((row) => ({
        code: parseInt(row.code),
        coOccurrences: parseInt(row.count),
        correlation: Math.min(parseInt(row.count) / totalOccurrences, 1),
      })),
      avgTimeBetweenOccurrences: this.formatDuration(avgTimeBetween),
      peakHours,
    };
  }

  async getAggregations(groupBy: string, limit: number, from?: Date, to?: Date) {
    let query = this.logsRepository.createQueryBuilder('log');

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

  async getTrends(days: number, severity?: string) {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    let query = this.logsRepository
      .createQueryBuilder('log')
      .select("strftime('%Y-%m-%d', log.timestamp)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('log.timestamp >= :from', { from: fromDate })
      .andWhere('log.timestamp <= :to', { to: toDate });

    if (severity) query = query.andWhere('log.severity = :severity', { severity });

    const results = await query.groupBy('date').orderBy('date', 'ASC').getRawMany();

    const dailyCounts = results.map((row) => ({
      date: row.date,
      count: parseInt(row.count),
    }));

    // Calculate trend
    if (dailyCounts.length < 2) {
      return {
        overallTrend: 'stable',
        changeRate: 0,
        anomalies: [],
        predictions: { nextDay: 0, nextWeek: 0 },
      };
    }

    const counts = dailyCounts.map((d) => d.count);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const firstHalf = counts.slice(0, Math.floor(counts.length / 2));
    const secondHalf = counts.slice(Math.floor(counts.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const changeRate = avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;

    let overallTrend: string;
    if (changeRate > 10) overallTrend = 'increasing';
    else if (changeRate < -10) overallTrend = 'decreasing';
    else overallTrend = 'stable';

    // Detect anomalies (values > 2 std deviations from mean)
    const stdDev = Math.sqrt(counts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / counts.length);

    const anomalies = dailyCounts
      .filter((d) => Math.abs(d.count - avg) > 2 * stdDev)
      .map((d) => ({
        date: d.date,
        count: d.count,
        expected: Math.round(avg),
        deviation: Math.abs(d.count - avg) / stdDev,
      }));

    // Simple prediction (linear trend)
    const predictions = {
      nextDay: Math.max(0, Math.round(avgSecond + (avgSecond - avgFirst) / days)),
      nextWeek: Math.max(0, Math.round((avgSecond + (avgSecond - avgFirst) / days) * 7)),
    };

    return {
      overallTrend,
      changeRate: Math.round(changeRate * 10) / 10,
      anomalies,
      predictions,
    };
  }

  private formatDuration(ms: number): string {
    if (ms === 0) return '0m';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
