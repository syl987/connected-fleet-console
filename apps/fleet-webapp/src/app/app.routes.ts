import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vehicles',
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./modules/vehicles/components/vehicles-page/vehicles-page.component').then(m => m.VehiclesPageComponent),
  },
  {
    path: '**',
    redirectTo: 'vehicles',
  },
];
