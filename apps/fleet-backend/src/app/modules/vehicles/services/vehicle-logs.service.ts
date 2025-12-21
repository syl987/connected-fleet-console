import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { Vehicle } from '../entities/vehicle.entity';

const SEARCH_QUERIES = [
  'log.message LIKE :search',
  'CAST(log.code AS TEXT) LIKE :search',
  'vehicle.brand LIKE :search',
  'vehicle.model LIKE :search',
  'vehicle.vin LIKE :search',
  'vehicle.color LIKE :search',
];

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

  async createMany(createDtos: CreateVehicleLogDto[]): Promise<VehicleLog[]> {
    if (!createDtos.length) return [];

    // Get unique vehicle IDs
    const vehicleIds = [...new Set(createDtos.map((dto) => dto.vehicleId))];

    // Fetch all vehicles at once
    const vehicles = await this.vehiclesRepository.findBy({ id: In(vehicleIds) });
    const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

    // Validate all vehicles exist
    const missingVehicleIds = vehicleIds.filter((id) => !vehicleMap.has(id));
    if (missingVehicleIds.length > 0) {
      throw new NotFoundException(`Vehicles not found: ${missingVehicleIds.join(', ')}`);
    }

    // Create logs
    const logs = createDtos.map((dto) =>
      this.vehicleLogsRepository.create({
        timestamp: new Date(dto.timestamp),
        severity: dto.severity,
        code: dto.code,
        message: dto.message,
        vehicle: vehicleMap.get(dto.vehicleId),
      }),
    );

    return this.vehicleLogsRepository.save(logs);
  }

  async findAll(
    page: number,
    size: number,
    search?: string,
    mileage?: number,
    year?: number,
    vehicle?: number,
    severity?: string,
    code?: string,
    from?: Date,
    to?: Date,
  ): Promise<{ items: VehicleLog[]; total: number }> {
    const queryBuilder = this.vehicleLogsRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.vehicle', 'vehicle');

    if (search) {
      queryBuilder.andWhere(`(${SEARCH_QUERIES.join(' OR ')})`, { search: `%${search}%` });
    }
    if (vehicle) {
      queryBuilder.andWhere('vehicle.id = :vehicleId', { vehicleId: vehicle });
    }
    if (mileage) {
      queryBuilder.andWhere('vehicle.mileage >= :mileage', { mileage });
    }
    if (year) {
      queryBuilder.andWhere('vehicle.year = :year', { year });
    }
    if (severity) {
      queryBuilder.andWhere('log.severity = :severity', { severity });
    }
    if (code) {
      queryBuilder.andWhere('log.code = :code', { code });
    }
    if (from) {
      queryBuilder.andWhere('log.timestamp >= :from', { from: from.toISOString() });
    }
    if (to) {
      queryBuilder.andWhere('log.timestamp <= :to', { to: to.toISOString() });
    }
    queryBuilder.orderBy('log.timestamp', 'DESC');
    queryBuilder.skip(page * size).take(size);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(id: number): Promise<VehicleLog> {
    const log = await this.vehicleLogsRepository.findOne({ where: { id }, relations: ['vehicle'] });
    if (!log) throw new NotFoundException(`Vehicle log ${id} not found`);
    return log;
  }

  findByVehicle(vehicleId: number): Promise<VehicleLog[]> {
    return this.vehicleLogsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['vehicle'],
      order: { timestamp: 'DESC' },
    });
  }
}
