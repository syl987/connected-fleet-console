import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';

// Load vehicles data from JSON file at runtime
function loadVehiclesFromJson() {
  try {
    // Use __dirname for production compatibility - resolves relative to compiled code location
    const filePath = join(__dirname, '../../../../assets/vehicles.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load vehicles.json:', (error as Error).message);
    return [];
  }
}

@Injectable()
export class VehiclesDataLoader {
  private readonly logger = new Logger(VehiclesDataLoader.name);

  constructor(@InjectRepository(Vehicle) private readonly repository: Repository<Vehicle>) {}

  async loadInitialData(): Promise<void> {
    const count = await this.repository.count();

    if (count > 0) {
      this.logger.log('Vehicles data already exists, skipping initial data load');
      return;
    }

    try {
      const initialVehicles = loadVehiclesFromJson();

      if (!Array.isArray(initialVehicles) || initialVehicles.length === 0) {
        this.logger.warn('No vehicles found in vehicles.json');
        return;
      }

      this.logger.log(`Loading ${initialVehicles.length} vehicles into database...`);

      const vehicles = initialVehicles.map((v: any) => {
        const vehicle = this.repository.create({
          brand: v.brand,
          model: v.model,
          year: v.year,
          vin: v.vin,
          mileage: v.mileage,
          color: v.color,
          fuelType: v.fuelType,
        } as Partial<Vehicle>);
        return vehicle;
      });

      await this.repository.save(vehicles);
      this.logger.log(`Successfully loaded ${vehicles.length} vehicles`);
    } catch (error) {
      this.logger.error(`Failed to load initial vehicle data: ${(error as Error).message}`, (error as Error).stack);
    }
  }
}
