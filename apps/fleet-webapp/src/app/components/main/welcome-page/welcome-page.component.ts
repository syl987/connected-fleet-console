import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppTechStackItem } from '../../../models/app.models';
import { TitleBarComponent } from '../../core/title-bar/title-bar.component';

const techStack: AppTechStackItem[] = [
  {
    title: `Angular ${VERSION.major}`,
    subtitle: `Main Framework`,
    description: `Leveraging signals, control flows, structured standalone architecture, lazy loading, etc.`,
    image: 'assets/img/logo/angular_gradient.png',
  },
  {
    title: `NestJS`,
    subtitle: `Back-End Framework`,
    description: `Standard endpoint design with controllers, services, modules, dependency injection, etc.`,
    image: 'https://nestjs.com/logo-small-gradient.0ed287ce.svg',
  },
  {
    title: `TypeScript`,
    subtitle: `JavaScript Extended`,
    description: `Strictly configured for null-safety, safe variable initialization and reliable use of types.`,
    image: 'https://iconape.com/wp-content/png_logo_vector/typescript.png',
    imageClass: 'pt-2',
  },
  {
    title: `Nx`,
    subtitle: `Monorepo Tool`,
    description: `Extensible dev tools for monorepos, helping with build, test, and deployment.`,
    image: 'https://dev-to-uploads.s3.amazonaws.com/i/jmsyzyk6pdkjf7bflwu2.png',
    imageClass: 'pt-6 pb-1',
  },
  {
    title: `Material 3`,
    subtitle: `Angular Components`,
    description: `Native Angular components with customized theming, typography and general appearance.`,
    image: 'https://v16.material.angular.io/assets/img/angular-material-logo.svg',
  },
  {
    title: `NGRX`,
    subtitle: `State Management, Logic`,
    description: `Application State and View fully decoupled! View all events in the browser console in real-time.`,
    image: 'https://ngrx.io/ngrx-logo.svg',
  },
  {
    title: `RXJS`,
    subtitle: `Reactive Extensions`,
    description: `Complex reactive processing of API requests and application data for display purposes.`,
    image: 'https://rxjs.dev/generated/images/marketing/home/Rx_Logo-512-512.png',
  },
  {
    title: `TailwindCSS 4`,
    subtitle: `CSS utilities`,
    description: `Consistent global utility syntax. Featuring layout, responsive grid, spacing, typography and more.`,
    image: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg',
    imageClass: 'py-2',
  },
  {
    title: `SCSS`,
    subtitle: `CSS Extended`,
    description: `Fully modular composition, global and component-scoped, variables, mixins, utilities.`,
    image: 'https://sass-lang.com/assets/img/logos/logo.svg',
  },
  {
    title: `Eslint 9`,
    subtitle: `Code Linting`,
    description: `Extensive custom flat configuration and numerous plugins for code automation.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESLint_logo.svg/192px-ESLint_logo.svg.png',
  },
  {
    title: `Prettier`,
    subtitle: `Code Formatting`,
    description: `Fully automated opinionated code quality tooling for consistency and opinionated appearance.`,
    image: 'https://prettier.io/icon.png',
  },
  {
    title: `Git`,
    subtitle: `Version Management`,
    description: `Structured and persistent development progression using branching, stashing, rebasing.`,
    image: 'https://cdn.freebiesupply.com/logos/large/2x/git-icon-logo-png-transparent.png',
  },
];

@Component({
  selector: 'app-welcome-page',
  imports: [CommonModule, MatCardModule, TitleBarComponent],
  templateUrl: './welcome-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  readonly techStack = techStack;
}
