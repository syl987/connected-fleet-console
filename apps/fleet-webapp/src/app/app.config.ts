import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { DefaultDataServiceConfig, DefaultDataServiceFactory, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideMarkdown } from 'ngx-markdown';
import { appRoutes } from './app.routes';
import { APP_LINKS, APP_OPTIONS, AppLinks, AppOptions } from './models/app.models';
import { formFieldOptions } from './options/form-field.options';
import { progressSpinnerOptions } from './options/progress-spinner.options';
import { snackBarOptions } from './options/snack-bar.options';
import { AppDefaultDataServiceFactory } from './services/data/default-data.service';
import { AppTitleStrategy } from './services/title-strategy';
import {
  effects,
  entityDataConfig,
  entityDataServiceConfig,
  reducers,
  routerStoreConfig,
  storeConfig,
} from './store/app.store';

registerLocaleData(localeDe);

const options: AppOptions = {
  applicationName: 'Connected Fleet Console',
  copyrightName: 'Igor M.',
  copyrightYear: new Date().getFullYear(),
};

const links: AppLinks = [
  { label: `Welcome`, icon: 'home', path: '/welcome' },
  { label: `Dashboard`, icon: 'dashboard', path: '/dashboard' },
  { label: `Vehicles`, icon: 'directions_car', path: '/vehicles' },
  { label: `Search`, icon: 'search', path: '/search' },
  { label: `Import`, icon: 'file_upload', path: '/import' },
  { label: `Docs`, icon: 'library_books', path: '/documentation' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideNativeDateAdapter(),
    provideHttpClient(),

    provideStore(reducers, storeConfig),
    provideEffects(effects),
    provideRouterStore(routerStoreConfig),
    provideEntityData(entityDataConfig, withEffects()),
    provideStoreDevtools({ maxAge: 25 }),

    provideMarkdown(),
    provideCharts(withDefaultRegisterables()),

    { provide: DefaultDataServiceFactory, useClass: AppDefaultDataServiceFactory },
    { provide: DefaultDataServiceConfig, useValue: entityDataServiceConfig },

    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, useValue: progressSpinnerOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },

    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: APP_OPTIONS, useValue: options },
    { provide: APP_LINKS, useValue: links },

    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
};
