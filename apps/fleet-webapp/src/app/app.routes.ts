import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'welcome',
    title: 'Welcome',
    loadComponent: () => import('./components/welcome-page/welcome-page.component').then(m => m.WelcomePageComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
