import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { UpdateVehicleLogDto } from '../dto/update-vehicle-log.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(VehicleLog) private readonly repository: Repository<VehicleLog>,
    @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateVehicleLogDto): Promise<VehicleLog> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: createDto.vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehicle ${createDto.vehicleId} not found`);

    const log = this.repository.create({
      timestamp: new Date(createDto.timestamp),
      severity: createDto.severity,
      code: createDto.code,
      message: createDto.message,
      vehicle,
    });
    return this.repository.save(log);
  }

  async findAll(page?: number, size?: number, vehicleId?: number): Promise<{ items: VehicleLog[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('log').leftJoinAndSelect('log.vehicle', 'vehicle');

    if (vehicleId) {
      queryBuilder.where('vehicle.id = :vehicleId', { vehicleId });
    }

    if (page && size) {
      queryBuilder.skip((page - 1) * size).take(size);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(id: number): Promise<VehicleLog> {
    const log = await this.repository.findOne({ where: { id }, relations: ['vehicle'] });
    if (!log) throw new NotFoundException(`Vehicle log ${id} not found`);
    return log;
  }

  async findByVehicle(vehicleId: number): Promise<VehicleLog[]> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehicle ${vehicleId} not found`);

    return this.repository.find({
      where: { vehicle: { id: vehicleId } },
      order: { timestamp: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateVehicleLogDto): Promise<VehicleLog> {
    const log = await this.findOne(id);

    if (updateDto.vehicleId && updateDto.vehicleId !== log.vehicle.id) {
      const vehicle = await this.vehicleRepository.findOne({ where: { id: updateDto.vehicleId } });
      if (!vehicle) throw new NotFoundException(`Vehicle ${updateDto.vehicleId} not found`);
      log.vehicle = vehicle;
    }

    if (updateDto.timestamp) log.timestamp = new Date(updateDto.timestamp);
    if (updateDto.severity) log.severity = updateDto.severity;
    if (updateDto.code !== undefined) log.code = updateDto.code;
    if (updateDto.message) log.message = updateDto.message;

    return this.repository.save(log);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repository.softDelete(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle log ${id} not found`);
  }

  async restore(id: number): Promise<VehicleLog> {
    const res = await this.repository.restore(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle log ${id} not found or not deleted`);
    return this.findOne(id);
  }

  findDeleted(): Promise<VehicleLog[]> {
    return this.repository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .withDeleted()
      .where('log.deletedAt IS NOT NULL')
      .getMany();
  }
}
