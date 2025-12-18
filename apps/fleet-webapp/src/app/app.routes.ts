import { Route } from '@angular/router';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'welcome',
    title: 'Welcome',
    component: WelcomePageComponent,
  },
  {
    path: 'vehicles',
    title: 'Vehicles',
    loadComponent: () => import('./modules/vehicles/components/vehicles-page/vehicles-page.component').then(m => m.VehiclesPageComponent),
  },
  {
    path: 'vehicles/:id',
    title: 'Vehicle Details',
    loadComponent: () => import('./modules/vehicles/components/vehicle-page/vehicle-page.component').then(m => m.VehiclePageComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
