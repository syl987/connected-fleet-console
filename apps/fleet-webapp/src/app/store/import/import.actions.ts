import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { VehicleLog } from '../../models/vehicle-log.models';

export const ImportActions = createActionGroup({
  source: 'VehicleLogs/import/API',
  events: {
    importVehicleLogs: props<{ file: File }>(),
    importVehicleLogsSUCCESS: props<{ logs: VehicleLog[] }>(),
    importVehicleLogsERROR: emptyProps(),
    clearVehicleLogs: emptyProps(),
  },
});
