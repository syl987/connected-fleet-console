import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private readonly repository: Repository<Vehicle>) {}

  create(createDto: CreateVehicleDto): Promise<Vehicle> {
    const v = this.repository.create(createDto as Partial<Vehicle>);
    return this.repository.save(v);
  }

  findAll(): Promise<Vehicle[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const v = await this.repository.findOneBy({ id });
    if (!v) throw new NotFoundException(`Vehicle ${id} not found`);
    return v;
  }

  async update(id: number, updateDto: UpdateVehicleDto): Promise<Vehicle> {
    await this.repository.update(id, updateDto as Partial<Vehicle>);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repository.softDelete(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle ${id} not found`);
  }

  async restore(id: number): Promise<Vehicle> {
    const res = await this.repository.restore(id);
    if (res.affected === 0) throw new NotFoundException(`Vehicle ${id} not found or not deleted`);
    return this.findOne(id);
  }

  findDeleted(): Promise<Vehicle[]> {
    return this.repository
      .createQueryBuilder('vehicle')
      .withDeleted()
      .where('vehicle.deletedAt IS NOT NULL')
      .getMany();
  }
}
