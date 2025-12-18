import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DefaultDataServiceConfig, EntityDataService, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { APP_LINKS, APP_OPTIONS, AppLinks, AppOptions } from './models/app.models';
import { VehicleDataService } from './services/vehicle-data.service';
import { effects, entityDataConfig, entityDataServiceConfig, reducers, routerStoreConfig, storeConfig } from './store/app.store';

const options: AppOptions = {
  applicationName: 'Connected Fleet Console',
  copyrightName: 'Igor M.',
  copyrightYear: new Date().getFullYear(),
};

const links: AppLinks = [
  { label: `Welcome`, icon: 'home', path: '/welcome' },
  { label: `Dashboard`, icon: 'dashboard', path: '/dashboard' },
  { label: `Vehicles`, icon: 'directions_car', path: '/vehicles' },
  { label: `Logs`, icon: 'library_books', path: '/logs' },
  { label: `Docs`, icon: 'article', path: '/documentation' },
];

function registerVehicleDataService(): () => void {
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
    { provide: APP_OPTIONS, useValue: options },
    { provide: APP_LINKS, useValue: links },
  ],
};
