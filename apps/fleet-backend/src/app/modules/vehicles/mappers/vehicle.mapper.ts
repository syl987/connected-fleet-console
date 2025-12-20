import { VehicleDto } from '../dto/vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

export function toVehicleDto(e: Vehicle): VehicleDto {
  return {
    id: e.id,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    deletedAt: e.deletedAt?.toISOString(),
    version: e.version,
    brand: e.brand,
    model: e.model,
    year: e.year,
    vin: e.vin,
    mileage: e.mileage,
    color: e.color,
    fuelType: e.fuelType,
  };
}
