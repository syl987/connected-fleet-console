import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter, TitleStrategy } from '@angular/router';
import { DefaultDataServiceConfig, EntityDataService, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { APP_LINKS, APP_OPTIONS, AppLinks, AppOptions } from './models/app.models';
import { formFieldOptions } from './options/form-field.options';
import { progressSpinnerOptions } from './options/progress-spinner.options';
import { snackBarOptions } from './options/snack-bar.options';
import { VehicleDataService } from './services/data/vehicle-data.service';
import { AppTitleStrategy } from './services/title-strategy';
import {
  effects,
  entityDataConfig,
  entityDataServiceConfig,
  reducers,
  routerStoreConfig,
  storeConfig,
} from './store/app.store';

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
  return (data = inject(EntityDataService), vehicleDataService = inject(VehicleDataService)) =>
    data.registerService('Vehicle', vehicleDataService);
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
    /* { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions }, */
    /* { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions }, */
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, useValue: progressSpinnerOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    /* { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions }, */
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: APP_OPTIONS, useValue: options },
    { provide: APP_LINKS, useValue: links },
  ],
};
