import { createEntityCacheSelector, EntityCollection } from '@ngrx/data';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EntityType } from '../../models/entity.models';
import { VehicleLog } from '../../models/vehicle-log.models';
import { ImportActions } from './import.actions';

export const importFeatureKey = 'import';

export interface State {
  ids: number[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: State = {
  ids: [],
  loading: false,
  loaded: false,
};

export const reducer = createReducer(
  initialState,
  on(ImportActions.importVehicleLogs, (state) => ({
    ...state,
    loading: true,
  })),
  on(ImportActions.importVehicleLogsSUCCESS, (state, { logs }) => ({
    ...state,
    ids: logs.map((log) => log.id),
    loading: false,
    loaded: true,
  })),
  on(ImportActions.importVehicleLogsERROR, (state) => ({
    ...state,
    loading: false,
    loaded: false,
  })),
  on(ImportActions.clearVehicleLogs, (state) => ({
    ...state,
    ids: [],
    loaded: false,
  })),
);

export const importFeature = createFeature({
  name: importFeatureKey,
  reducer,
  extraSelectors: ({ selectIds }) => ({
    selectAll: createSelector(
      createSelector(createEntityCacheSelector('entityCache'), (cache) => cache[EntityType.VehicleLog]),
      selectIds,
      (cache: EntityCollection<VehicleLog>, ids) =>
        ids.map((id) => cache.entities[id]).filter((log): log is NonNullable<typeof log> => log != null),
    ),
  }),
});
