import { isDevMode } from '@angular/core';
import { DefaultDataServiceConfig, PropsFilterFnFactory } from '@ngrx/data';
import {
  MinimalRouterStateSnapshot,
  routerReducer,
  RouterReducerState,
  RouterState,
  StoreRouterConfig,
} from '@ngrx/router-store';
import { ActionReducerMap, RootStoreConfig } from '@ngrx/store';
import { AppEntityCache, AppEntityDataModuleConfig } from '../models/app.models';
import { EntityType } from '../models/entity.models';
import { ToastEffects } from './effects/toast.effects';
import { UndoEffects } from './effects/undo.effects';
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

export const entityDataServiceConfig: DefaultDataServiceConfig = {
  root: '/api',
  getDelay: 4500, // fake delay for showcasing loading indicators
  saveDelay: 750, // fake delay for showcasing loading indicators
};

export const entityDataConfig: AppEntityDataModuleConfig = {
  entityMetadata: {
    [EntityType.Vehicle]: {
      sortComparer: undefined, // TODO add default comparer
      filterFn: PropsFilterFnFactory([
        'brand',
        'model',
        'year',
        'vin',
        'mileage',
      ]),
    },
  },
};

export const effects = [LogsEffects, ToastEffects, UndoEffects];

export interface AppState extends RootState {
  entityCache: AppEntityCache;
}

export const storeConfig: RootStoreConfig<RootState> = {
  metaReducers: [],
  runtimeChecks: {
    strictStateImmutability: isDevMode(),
    strictStateSerializability: isDevMode(),
  },
};

export const routerStoreConfig: StoreRouterConfig = {
  routerState: RouterState.Minimal,
};
