import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Page } from '../../models/entity.models';
import { Log, SearchLogsParams } from '../../models/log.models';

export const LogsActions = createActionGroup({
  source: 'Logs/API',
  events: {
    search: props<{ params: SearchLogsParams }>(),
    searchSUCCESS: props<{ page: Page<Log> }>(),
    searchERROR: emptyProps(),
    clear: emptyProps(),
  },
});
