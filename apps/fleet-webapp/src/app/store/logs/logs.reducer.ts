import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Log } from '../../models/log.models';
import { LogsActions } from './logs.actions';

export const logsFeatureKey = 'logs';

export interface State extends EntityState<Log> {
  currentIds: number[];
  pagination?: { page: number; size: number };
  loading: boolean;
}

export const adapter: EntityAdapter<Log> = createEntityAdapter<Log>({
  sortComparer: (a, b) => a.timestamp.localeCompare(b.timestamp),
});

export const initialState: State = adapter.getInitialState({
  currentIds: [],
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(LogsActions.search, (state, { params }) => ({
    ...state,
    pagination: { page: params.page, size: params.size },
    loading: true,
  })),
  on(LogsActions.searchSUCCESS, (state, { page }) =>
    adapter.upsertMany(page.data, { ...state, currentIds: page.data.map((log) => log.id), loading: false })),
  on(LogsActions.searchERROR, (state) => ({ ...state, loading: false })),
  on(LogsActions.clear, (state) => adapter.removeAll(state)),
);

export const logsFeature = createFeature({
  name: logsFeatureKey,
  reducer,
  extraSelectors: ({ selectLogsState }) => ({
    ...adapter.getSelectors(selectLogsState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = logsFeature;
