import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleLogsService {
  constructor(
    @InjectRepository(VehicleLog) private readonly vehicleLogsRepository: Repository<VehicleLog>,
    @InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateVehicleLogDto): Promise<VehicleLog> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id: createDto.vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehicle ${createDto.vehicleId} not found`);

    const log = this.vehicleLogsRepository.create({
      timestamp: new Date(createDto.timestamp),
      severity: createDto.severity,
      code: createDto.code,
      message: createDto.message,
      vehicle,
    });
    return this.vehicleLogsRepository.save(log);
  }

  async findAll(page?: number, size?: number, search?: string): Promise<{ items: VehicleLog[]; total: number }> {
    const queryBuilder = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle');

    if (search) {
      queryBuilder.where(
        '(log.message LIKE :search OR log.severity LIKE :search OR CAST(log.code AS TEXT) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('log.timestamp', 'DESC');

    if (page && size) {
      queryBuilder.skip((page - 1) * size).take(size);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(id: number): Promise<VehicleLog> {
    const log = await this.vehicleLogsRepository.findOne({ where: { id }, relations: ['vehicle'] });
    if (!log) throw new NotFoundException(`Vehicle log ${id} not found`);
    return log;
  }

  async findByVehicle(vehicleId: number): Promise<VehicleLog[]> {
    return this.vehicleLogsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['vehicle'],
      order: { timestamp: 'DESC' },
    });
  }
}
