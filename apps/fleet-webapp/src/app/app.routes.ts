import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vehicles',
  },
  {
    path: '',
    loadComponent: () => import('./components/welcome-page/welcome-page.component').then(m => m.WelcomePageComponent),
  },
  {
    path: '**',
    redirectTo: 'vehicles',
  },
];
