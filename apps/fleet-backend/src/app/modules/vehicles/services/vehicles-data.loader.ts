import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';

// Load vehicles data from JSON file at runtime
function loadVehiclesFromJson() {
  try {
    // Try multiple possible paths for different environments
    const possiblePaths = [
      join(process.cwd(), 'apps/fleet-backend/src/assets/vehicles.json'), // Development
      join(process.cwd(), 'dist/apps/fleet-backend/assets/vehicles.json'), // Production
    ];

    for (const filePath of possiblePaths) {
      try {
        const fileContent = readFileSync(filePath, 'utf-8');
        console.log(`Successfully loaded vehicles from: ${filePath}`);
        return JSON.parse(fileContent);
      } catch {
        // Try next path
      }
    }

    throw new Error('vehicles.json not found in any expected location');
  } catch (error) {
    console.error('Failed to load vehicles.json:', (error as Error).message);
    return [];
  }
}

@Injectable()
export class VehiclesDataLoader {
  private readonly logger = new Logger(VehiclesDataLoader.name);

  constructor(@InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>) {}

  async loadInitialData(): Promise<void> {
    const count = await this.vehiclesRepository.count();

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
        const vehicle = this.vehiclesRepository.create({
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

      await this.vehiclesRepository.save(vehicles);
      this.logger.log(`Successfully loaded ${vehicles.length} vehicles`);
    } catch (error) {
      this.logger.error(`Failed to load initial vehicle data: ${(error as Error).message}`, (error as Error).stack);
    }
  }
}
