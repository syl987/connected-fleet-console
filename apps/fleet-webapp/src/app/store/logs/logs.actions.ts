import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SearchLogsParams, VehicleLog } from '../../models/log.models';

export const LogsActions = createActionGroup({
  source: 'Logs/API',
  events: {
    search: props<{ params: SearchLogsParams }>(),
    searchSUCCESS: props<{ logs: VehicleLog[] }>(),
    searchERROR: emptyProps(),
    clear: emptyProps(),
  },
});
