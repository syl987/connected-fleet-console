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
import { LogsEffects } from './logs/logs.effects';
import * as fromLogs from './logs/logs.reducer';

export interface RootState {
  router: RouterReducerState<MinimalRouterStateSnapshot>;
  logs: fromLogs.State;
}

export const reducers: ActionReducerMap<RootState> = {
  router: routerReducer,
  logs: fromLogs.reducer,
};

export interface AppState extends RootState {
  entityCache: AppEntityCache;
}

export const entityDataConfig: AppEntityDataModuleConfig = {
  entityMetadata: {
    [EntityType.Vehicle]: {
      filterFn: PropsFilterFnFactory([
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
        'vehicleId',
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

export const effects = [LogsEffects, ToastEffects, UndoEffects];

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
