import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { VehicleLog } from '../../models/log.models';
import { LogsActions } from './logs.actions';

export const logsFeatureKey = 'logs';

export interface State extends EntityState<VehicleLog> {
  searching: boolean;
}

export const adapter: EntityAdapter<VehicleLog> = createEntityAdapter<VehicleLog>({
  sortComparer: (a, b) => a.timestamp.localeCompare(b.timestamp),
});

export const initialState: State = adapter.getInitialState({
  searching: false,
});

export const reducer = createReducer(
  initialState,
  on(LogsActions.search, (state, { params }) => ({ ...state, searching: true })),
  on(LogsActions.searchSUCCESS, (state, { logs }) =>
    adapter.upsertMany(logs, adapter.removeAll({ ...state, searching: false }))),
  on(LogsActions.searchERROR, (state) => ({ ...state, searching: false })),
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
