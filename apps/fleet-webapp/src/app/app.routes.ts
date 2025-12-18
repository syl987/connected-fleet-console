import { Route } from '@angular/router';
import { WelcomePageComponent } from './components/core/welcome-page/welcome-page.component';

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
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./components/dashboard/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
  },
  {
    path: 'vehicles',
    title: 'Vehicles',
    loadComponent: () => import('./components/vehicles/vehicles-list-page/vehicles-list-page.component').then(m => m.VehiclesListPageComponent),
  },
  {
    path: 'vehicles/:id',
    title: 'Vehicle Details',
    loadComponent: () => import('./components/vehicles/vehicle-detail-page/vehicle-detail-page.component').then(m => m.VehicleDetailPageComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
