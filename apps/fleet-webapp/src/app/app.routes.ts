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
    path: '**',
    redirectTo: 'welcome',
  },
];
