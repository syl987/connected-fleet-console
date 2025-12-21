import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Page } from '../../models/entity.models';
import { SearchLogsParams } from '../../models/search.models';
import { VehicleLog } from '../../models/vehicle-log.models';

export const SearchActions = createActionGroup({
  source: 'VehicleLogs/API',
  events: {
    searchVehicleLogs: props<{ params: SearchLogsParams }>(),
    searchVehicleLogsSUCCESS: props<{ page: Page<VehicleLog> }>(),
    searchVehicleLogsERROR: emptyProps(),
    clearVehicleLogs: emptyProps(),
  },
});
