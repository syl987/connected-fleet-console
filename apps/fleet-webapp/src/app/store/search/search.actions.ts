import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Page } from '../../models/entity.models';
import { Log, SearchLogsParams } from '../../models/log.models';

export const SearchActions = createActionGroup({
  source: 'Search/API',
  events: {
    searchLogs: props<{ params: SearchLogsParams }>(),
    searchLogsSUCCESS: props<{ page: Page<Log> }>(),
    searchLogsERROR: emptyProps(),
    clearLogs: emptyProps(),
  },
});
