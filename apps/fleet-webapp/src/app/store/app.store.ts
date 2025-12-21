import { isDevMode } from '@angular/core';
import { PropsFilterFnFactory } from '@ngrx/data';
import {
  MinimalRouterStateSnapshot,
  routerReducer,
  RouterReducerState,
  RouterState,
  StoreRouterConfig,
} from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';
import { AppDefaultDataServiceConfig, AppEntityCache, AppEntityDataModuleConfig } from '../models/app.models';
import { EntityType } from '../models/entity.models';

import { consoleLogMetaReducer } from './app.meta-reducers';
import { ToastEffects } from './core/toast.effects';
import { UndoEffects } from './core/undo.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';
import * as fromDashboard from './dashboard/dashboard.reducer';
import { SearchEffects } from './search/search.effects';
import * as fromSearch from './search/search.reducer';
import { VehicleLogEffects } from './vehicle-logs/vehicle-log.effects';
import * as fromVehicleLogs from './vehicle-logs/vehicle-log.reducer';

export interface RootState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  search: fromSearch.State;
  dashboard: fromDashboard.State;
  vehicleLogs: fromVehicleLogs.State;
}

export const reducers: ActionReducerMap<RootState> = {
  router: routerReducer,
  search: fromSearch.reducer,
  dashboard: fromDashboard.reducer,
  vehicleLogs: fromVehicleLogs.reducer,
};

export interface AppState extends RootState {
  entityCache: AppEntityCache;
}

export const entityDataConfig: AppEntityDataModuleConfig = {
  entityMetadata: {
    [EntityType.Vehicle]: {
      sortComparer: (a, b) => b.id - a.id, // ASC by id
      filterFn: PropsFilterFnFactory([
        'id',
        'brand',
        'model',
        'year',
        'vin',
        'mileage',
      ]),
    },
    [EntityType.VehicleLog]: {
      sortComparer: (a, b) => b.timestamp.localeCompare(a.timestamp), // DESC by timestamp
      filterFn: PropsFilterFnFactory([
        'id',
        'severity',
        'code',
        'message',
      ]),
    },
  },
};

export const entityDataServiceConfig: AppDefaultDataServiceConfig = {
  entityHttpResourceUrls: {
    [EntityType.Vehicle]: {
      collectionResourceUrl: '/api/vehicles', // kick trailing slash behavior to match backend API
      entityResourceUrl: '/api/vehicles/', // pluralize to match backend API
    },
    [EntityType.VehicleLog]: {
      collectionResourceUrl: '/api/logs/vehicles', // kick trailing slash behavior to match backend API
      entityResourceUrl: '/api/logs/vehicles/', // pluralize to match backend API
    },
  },
};

export const effects = [
  SearchEffects,
  DashboardEffects,
  VehicleLogEffects,
  ToastEffects,
  UndoEffects,
];

export const storeConfig: RootStoreConfig<RootState> = {
  metaReducers: [consoleLogMetaReducer],
  runtimeChecks: {
    strictStateImmutability: isDevMode(),
    strictStateSerializability: isDevMode(),
  },
};

export const routerStoreConfig: StoreRouterConfig = {
  routerState: RouterState.Minimal,
};
