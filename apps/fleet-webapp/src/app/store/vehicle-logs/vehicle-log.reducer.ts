import { createEntityCacheSelector, EntityCollection } from '@ngrx/data';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EntityType } from '../../models/entity.models';
import { VehicleLog } from '../../models/vehicle-log.models';
import { VehicleLogIds } from '../../models/vehicle.models';
import { VehicleLogActions } from './vehicle-log.actions';
import { createVehicleLogIds } from './vehicle-log.helpers';

export const vehicleLogsFeatureKey = 'vehicleLogs';

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
  on(VehicleLogActions.loadVehicleLogs, (state) => ({
    ...state,
    loading: true,
  })),
  on(VehicleLogActions.loadVehicleLogsSUCCESS, (state, { vehicleId, logs }) =>
    adapter.setOne(createVehicleLogIds(vehicleId, logs), {
      ...state,
      loading: false,
      loaded: true,
    })),
  on(VehicleLogActions.loadVehicleLogsERROR, (state) => ({
    ...state,
    loading: false,
    loaded: false,
  })),
);

export const vehicleLogsFeature = createFeature({
  name: vehicleLogsFeatureKey,
  reducer,
  extraSelectors: ({ selectEntities }) => ({
    selectAllByVehicleId: (vehicleId: string | number) =>
      createSelector(
        createSelector(createEntityCacheSelector('entityCache'), (cache) => cache[EntityType.VehicleLog]),
        selectEntities,
        (cache: EntityCollection<VehicleLog>, entities) =>
          entities[vehicleId]?.logIds
            .map((id) => cache.entities[id])
            .filter((log): log is NonNullable<typeof log> => log != null),
      ),
  }),
});
