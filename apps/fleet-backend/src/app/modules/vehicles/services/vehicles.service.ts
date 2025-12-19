import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>) {}

  create(createDto: CreateVehicleDto): Promise<Vehicle> {
    const v = this.vehiclesRepository.create(createDto as Partial<Vehicle>);
    return this.vehiclesRepository.save(v);
  }

  async findAll(page: number, size: number): Promise<{ items: Vehicle[]; total: number }> {
    const [items, total] = await this.vehiclesRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });
    return { items, total };
  }

  async findOne(id: number): Promise<Vehicle> {
    const v = await this.vehiclesRepository.findOne({ where: { id }, relations: ['logs'] });
    if (!v) throw new NotFoundException(`Vehicle ${id} not found`);
    return v;
  }

  async update(id: number, updateDto: UpdateVehicleDto): Promise<Vehicle> {
    await this.vehiclesRepository.update(id, updateDto as Partial<Vehicle>);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.vehiclesRepository.softDelete(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle ${id} not found`);
  }

  async restore(id: number): Promise<Vehicle> {
    const res = await this.vehiclesRepository.restore(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle ${id} not found or not deleted`);
    return this.findOne(id);
  }

  findDeleted(): Promise<Vehicle[]> {
    return this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .withDeleted()
      .where('vehicle.deletedAt IS NOT NULL')
      .getMany();
  }
}
