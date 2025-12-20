import { VehicleLogDto } from '../dto/vehicle-log.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { toVehicleDto } from './vehicle.mapper';

export function toVehicleLogDto(e: VehicleLog): VehicleLogDto {
  return {
    id: e.id,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    deletedAt: e.deletedAt?.toISOString(),
    version: e.version,
    timestamp: e.timestamp.toISOString(),
    severity: e.severity,
    code: e.code,
    message: e.message,
    vehicle: e.vehicle ? toVehicleDto(e.vehicle) : undefined,
  };
}
