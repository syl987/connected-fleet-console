import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { VehicleLog } from '../../models/vehicle-log.models';

export const VehicleLogActions = createActionGroup({
  source: 'VehicleLog/API',
  events: {
    loadVehicleLogs: props<{ vehicleId: number }>(),
    loadVehicleLogsSUCCESS: props<{ vehicleId: number; logs: VehicleLog[] }>(),
    loadVehicleLogsERROR: emptyProps(),
  },
});
