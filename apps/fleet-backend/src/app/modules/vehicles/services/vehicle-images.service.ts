import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from '../../../common/entities/file.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleImagesService {
  constructor(
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(vehicleId: number, file: any): Promise<ImageEntity> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId }, relations: ['image'] });
    if (!vehicle) throw new NotFoundException(`Vehicle ${vehicleId} not found`);

    // Replace existing image if present
    if (vehicle.image) {
      await this.imageRepository.delete(vehicle.image.id);
    }

    const img = this.imageRepository.create({
      filename: file.originalname,
      data: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
    } as Partial<ImageEntity>);

    const saved = await this.imageRepository.save(img);
    vehicle.image = saved;
    await this.vehicleRepository.save(vehicle);
    return saved;
  }

  async findAllByVehicle(vehicleId: number): Promise<ImageEntity[]> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId }, relations: ['image'] });
    if (!vehicle) throw new NotFoundException(`Vehicle ${vehicleId} not found`);
    return vehicle.image ? [vehicle.image] : [];
  }

  async findOne(id: number): Promise<ImageEntity> {
    const img = await this.imageRepository.findOne({ where: { id } });
    if (!img) throw new NotFoundException(`Image ${id} not found`);
    return img;
  }

  async remove(vehicleId: number, imageId: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId }, relations: ['image'] });
    if (!vehicle || !vehicle.image || vehicle.image.id !== imageId)
      throw new NotFoundException(`Image ${imageId} not found for vehicle ${vehicleId}`);

    await this.imageRepository.delete(imageId);
    vehicle.image = undefined;
    await this.vehicleRepository.save(vehicle);
  }
}
