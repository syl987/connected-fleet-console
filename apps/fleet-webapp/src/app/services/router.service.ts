import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);

  readonly url$ = this.store.select(getRouterSelectors().selectUrl);
  readonly title$ = this.store.select(getRouterSelectors().selectTitle);
  readonly fragment$ = this.store.select(getRouterSelectors().selectFragment);

  readonly routeParams$ = this.store.select(getRouterSelectors().selectRouteParams);
  readonly queryParams$ = this.store.select(getRouterSelectors().selectQueryParams);

  getCurrentNavigationState(): Record<string, unknown> {
    return this.router.currentNavigation()?.extras.state ?? {};
  }
}
