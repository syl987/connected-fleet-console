import { Route } from '@angular/router';
import { WelcomePageComponent } from './components/main/welcome-page/welcome-page.component';
import { loadVehicleResolver } from './resolvers/load-vehicle.resolver';
import { loadVehiclesResolver } from './resolvers/load-vehicles.resolver';

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
    loadComponent: () =>
      import('./components/main/dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'documentation',
    title: 'Documentation',
    loadComponent: () =>
      import('./components/main/documentation-page/documentation-page.component').then(
        (m) => m.DocumentationPageComponent,
      ),
  },
  {
    path: 'vehicles',
    title: 'Vehicles',
    resolve: { vehicles: loadVehiclesResolver },
    loadComponent: () =>
      import('./components/vehicles/vehicles-list-page/vehicles-list-page.component').then(
        (m) => m.VehiclesListPageComponent,
      ),
  },
  {
    path: 'vehicles/:id',
    title: 'Vehicle Details',
    resolve: { vehicles: loadVehicleResolver },
    loadComponent: () =>
      import('./components/vehicles/vehicle-detail-page/vehicle-detail-page.component').then(
        (m) => m.VehicleDetailPageComponent,
      ),
  },
  {
    path: 'logs',
    title: 'Logs',
    loadComponent: () =>
      import('./components/main/logs-search-page/logs-search-page.component').then((m) => m.LogsSearchPageComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
