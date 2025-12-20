import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { VehicleLog } from '../../models/vehicle-log.models';

export const VehicleActions = createActionGroup({
  source: 'Vehicle/API',
  events: {
    loadVehicleLogs: props<{ vehicleId: number }>(),
    loadVehicleLogsSUCCESS: props<{ vehicleId: number; logs: VehicleLog[] }>(),
    loadVehicleLogsERROR: emptyProps(),
  },
});
