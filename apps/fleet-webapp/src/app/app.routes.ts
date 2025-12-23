import { Route } from '@angular/router';
import { WelcomePageComponent } from './components/main/welcome-page/welcome-page.component';
import { loadVehicleLogsResolver } from './resolvers/load-vehicle-logs.resolver';
import { loadVehicleResolver } from './resolvers/load-vehicle.resolver';
import { loadVehiclesResolver } from './resolvers/load-vehicles.resolver';
import { streamVehicleLogsSummaryResolver } from './resolvers/stream-vehicle-logs-summary.resolver';

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
    resolve: { summary: streamVehicleLogsSummaryResolver },
    loadComponent: () =>
      import('./components/main/dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
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
    resolve: { vehicles: loadVehicleResolver, vehicleLogs: loadVehicleLogsResolver },
    loadComponent: () =>
      import('./components/vehicles/vehicle-detail-page/vehicle-detail-page.component').then(
        (m) => m.VehicleDetailPageComponent,
      ),
  },
  {
    path: 'search',
    title: 'Search Vehicle Logs',
    loadComponent: () =>
      import('./components/main/search-page/search-page.component').then((m) => m.SearchPageComponent),
  },
  {
    path: 'import',
    title: 'Import Vehicle Logs',
    loadComponent: () =>
      import('./components/main/import-page/import-page.component').then((m) => m.ImportPageComponent),
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
    path: '**',
    redirectTo: 'welcome',
  },
];
