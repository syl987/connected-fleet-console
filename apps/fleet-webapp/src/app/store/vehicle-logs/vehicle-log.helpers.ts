import { VehicleLog } from '../../models/vehicle-log.models';
import { VehicleLogIds } from '../../models/vehicle.models';

export function createVehicleLogIds(vehicleId: number, vehicleLogs: VehicleLog[]): VehicleLogIds {
  return { vehicleId, logIds: vehicleLogs.map(({ id }) => id) };
}
