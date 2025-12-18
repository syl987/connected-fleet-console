import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DefaultDataServiceConfig, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { APP_LINKS, APP_OPTIONS, AppLinks, AppOptions } from './models/app.models';
import { effects, entityDataConfig, entityDataServiceConfig, reducers, routerStoreConfig, storeConfig } from './store/app.store';

const options: AppOptions = {
  applicationName: 'Connected Fleet Console',
  copyrightName: 'Igor M.',
  copyrightYear: new Date().getFullYear(),
};

const links: AppLinks = [
  { label: `Welcome`, icon: 'home', path: '/welcome' },
];

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
    { provide: DefaultDataServiceConfig, useValue: entityDataServiceConfig },
    { provide: APP_OPTIONS, useValue: options },
    { provide: APP_LINKS, useValue: links },
  ],
};
