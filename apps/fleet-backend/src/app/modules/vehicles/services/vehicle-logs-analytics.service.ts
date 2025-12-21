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
}
