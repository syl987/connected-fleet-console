import { createEntityCacheSelector, EntityCollection } from '@ngrx/data';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EntityType } from '../../models/entity.models';
import { VehicleLog } from '../../models/vehicle-log.models';
import { VehicleLogIds } from '../../models/vehicle.models';
import { VehicleActions } from './vehicle.actions';
import { createVehicleLogIds } from './vehicle.helpers';

export const vehicleFeatureKey = 'vehicles';

export interface State extends EntityState<VehicleLogIds> {
  loading: boolean;
  loaded: boolean;
}

const adapter = createEntityAdapter<VehicleLogIds>({
  selectId: ({ vehicleId }) => vehicleId,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
});

export const reducer = createReducer(
  initialState,
  on(VehicleActions.loadVehicleLogs, (state) => ({
    ...state,
    loading: true,
  })),
  on(VehicleActions.loadVehicleLogsSUCCESS, (state, { vehicleId, logs }) =>
    adapter.setOne(createVehicleLogIds(vehicleId, logs), {
      ...state,
      loading: false,
      loaded: true,
    })),
  on(VehicleActions.loadVehicleLogsERROR, (state) => ({
    ...state,
    loading: false,
    loaded: false,
  })),
);

export const vehicleFeature = createFeature({
  name: vehicleFeatureKey,
  reducer,
  extraSelectors: ({ selectEntities }) => ({
    selectAllByVehicleId: (vehicleId: number) =>
      createSelector(
        createSelector(createEntityCacheSelector('entityCache'), (cache) => cache[EntityType.VehicleLog]),
        ((vehicleId: number) => createSelector(selectEntities, (entities) => entities[vehicleId]?.logIds ?? []))(
          vehicleId,
        ),
        (cache: EntityCollection<VehicleLog>, ids) =>
          ids.map((id) => cache.entities[id]).filter((log): log is NonNullable<typeof log> => log != null),
      ),
  }),
});
