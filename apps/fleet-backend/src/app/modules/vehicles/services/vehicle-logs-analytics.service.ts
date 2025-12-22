import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogSeverity } from '../../../common/entities/log.entity';
import { VehicleLogsColorStatsDto } from '../dto/vehicle-logs-color-stats.dto';
import { VehicleLogsSeverityStatsDto } from '../dto/vehicle-logs-severity-stats.dto';
import { VehicleLogsSummaryDto } from '../dto/vehicle-logs-summary.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';

@Injectable()
export class VehicleLogsAnalyticsService {
  constructor(@InjectRepository(VehicleLog) private readonly vehicleLogsRepository: Repository<VehicleLog>) {}

  async getSummary(): Promise<VehicleLogsSummaryDto> {
    const totalLogs = await this.vehicleLogsRepository.count();

    const { earliestDate, latestDate, highestMileage, latestYear } = await this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .select('MIN(log.timestamp)', 'earliestDate')
      .addSelect('MAX(log.timestamp)', 'latestDate')
      .addSelect('MAX(vehicle.mileage)', 'highestMileage')
      .addSelect('MAX(vehicle.year)', 'latestYear')
      .getRawOne();

    return {
      totalLogs,
      earliestDate,
      latestDate,
      highestMileage: parseInt(highestMileage, 10),
      latestYear: parseInt(latestYear, 10),
    };
  }

  async getSeverityStats(): Promise<VehicleLogsSeverityStatsDto> {
    const query = this.vehicleLogsRepository.createQueryBuilder('log').leftJoin('log.vehicle', 'vehicle');

    const severityStats = await query
      .select('log.severity', 'severity')
      .addSelect('COUNT(log.id)', 'count')
      .addSelect('COUNT(DISTINCT vehicle.id)', 'vehicles')
      .groupBy('log.severity')
      .orderBy('count', 'DESC')
      .getRawMany();

    const totalLogs = severityStats.reduce((sum, stat) => sum + parseInt(stat.count, 10), 0);

    const stats = severityStats.map((stat) => ({
      severity: stat.severity,
      count: parseInt(stat.count, 10),
      vehicles: parseInt(stat.vehicles, 10),
    }));

    return { totalLogs, stats };
  }

  async getColorStats(): Promise<VehicleLogsColorStatsDto> {
    const totalLogs = await this.vehicleLogsRepository.count();

    const statsBySeverity = await Promise.all(
      Object.keys(LogSeverity).map(async (severity: LogSeverity) => {
        const colorStats = await this.vehicleLogsRepository
          .createQueryBuilder('log')
          .innerJoin('log.vehicle', 'vehicle')
          .where('log.severity = :severity', { severity })
          .select('log.severity', 'severity')
          .select('vehicle.color', 'color')
          .addSelect('COUNT(log.id)', 'count')
          .addSelect('COUNT(DISTINCT vehicle.id)', 'vehicles')
          .groupBy('vehicle.color')
          .orderBy('count', 'DESC')
          .getRawMany();

        const totalLogs = colorStats.reduce((sum, stat) => sum + parseInt(stat.count, 10), 0);

        const stats = colorStats.map((stat) => ({
          color: stat.color,
          count: parseInt(stat.count, 10),
          vehicles: parseInt(stat.vehicles, 10),
        }));
        return { totalLogs, stats, severity };
      }),
    );
    return { totalLogs, stats: statsBySeverity };
  }
}
