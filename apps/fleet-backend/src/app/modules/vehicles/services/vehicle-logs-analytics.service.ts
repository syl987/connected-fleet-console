import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleLogsSummaryDto } from '../dto/vehicle-logs-summary.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';

@Injectable()
export class VehicleLogsAnalyticsService {
  constructor(@InjectRepository(VehicleLog) private readonly vehicleLogsRepository: Repository<VehicleLog>) {}

  async getSummary(): Promise<VehicleLogsSummaryDto> {
    const totalLogs = await this.vehicleLogsRepository.count();

    const { earliestDate, latestDate, highestMileage } = await this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .select('MIN(log.timestamp)', 'earliestDate')
      .addSelect('MAX(log.timestamp)', 'latestDate')
      .addSelect('MAX(vehicle.mileage)', 'highestMileage')
      .getRawOne();

    return { totalLogs, earliestDate, latestDate, highestMileage };
  }
}
