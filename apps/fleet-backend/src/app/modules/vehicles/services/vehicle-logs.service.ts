import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { UpdateVehicleLogDto } from '../dto/update-vehicle-log.dto';
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

  async findAll(
    page?: number,
    size?: number,
    vehicleId?: number,
    search?: string,
  ): Promise<{ items: VehicleLog[]; total: number }> {
    const queryBuilder = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle');

    if (vehicleId) {
      queryBuilder.andWhere('vehicle.id = :vehicleId', { vehicleId });
    }

    if (search) {
      queryBuilder.andWhere(
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
    const vehicle = await this.vehiclesRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehicle ${vehicleId} not found`);

    return this.vehicleLogsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['vehicle'],
      order: { timestamp: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateVehicleLogDto): Promise<VehicleLog> {
    const log = await this.findOne(id);

    if (updateDto.vehicleId && updateDto.vehicleId !== log.vehicle.id) {
      const vehicle = await this.vehiclesRepository.findOne({ where: { id: updateDto.vehicleId } });
      if (!vehicle) throw new NotFoundException(`Vehicle ${updateDto.vehicleId} not found`);
      log.vehicle = vehicle;
    }

    if (updateDto.timestamp) log.timestamp = new Date(updateDto.timestamp);
    if (updateDto.severity) log.severity = updateDto.severity;
    if (updateDto.code !== undefined) log.code = updateDto.code;
    if (updateDto.message) log.message = updateDto.message;

    return this.vehicleLogsRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const res = await this.vehicleLogsRepository.softDelete(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle log ${id} not found`);
  }

  async restore(id: number): Promise<VehicleLog> {
    const res = await this.vehicleLogsRepository.restore(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle log ${id} not found or not deleted`);
    return this.findOne(id);
  }

  findDeleted(): Promise<VehicleLog[]> {
    return this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle')
      .withDeleted()
      .where('log.deletedAt IS NOT NULL')
      .getMany();
  }
}
