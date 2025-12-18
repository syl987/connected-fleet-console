import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DefaultDataServiceConfig, EntityDataService, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { VehicleDataService } from './services/vehicle-data.service';
import { effects, entityDataConfig, entityDataServiceConfig, reducers, routerStoreConfig, storeConfig } from './store/app.store';

export function registerVehicleDataService(): () => void {
  return (data = inject(EntityDataService), vehicleDataService = inject(VehicleDataService)) => data.registerService('Vehicle', vehicleDataService);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore(reducers, storeConfig),
    provideEffects(effects),
    provideRouterStore(routerStoreConfig),
    provideEntityData(entityDataConfig, withEffects()),
    provideStoreDevtools({ maxAge: 25 }),
    provideAppInitializer(registerVehicleDataService()),
    { provide: DefaultDataServiceConfig, useValue: entityDataServiceConfig },
  ],
};
