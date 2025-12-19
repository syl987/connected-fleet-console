import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Log, SearchLogsParams } from '../../models/log.models';

export const LogsActions = createActionGroup({
  source: 'Logs/API',
  events: {
    search: props<{ params: SearchLogsParams }>(),
    searchSUCCESS: props<{ logs: Log[] }>(),
    searchERROR: emptyProps(),
    clear: emptyProps(),
  },
});
