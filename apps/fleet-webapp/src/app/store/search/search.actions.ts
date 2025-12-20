import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Page } from '../../models/entity.models';
import { SearchLogsParams } from '../../models/search.models';
import { VehicleLog } from '../../models/vehicle-log.models';

export const SearchActions = createActionGroup({
  source: 'Search/API',
  events: {
    searchLogs: props<{ params: SearchLogsParams }>(),
    searchLogsSUCCESS: props<{ page: Page<VehicleLog> }>(),
    searchLogsERROR: emptyProps(),
    clearLogs: emptyProps(),
  },
});
