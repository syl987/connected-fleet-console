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

  readonly url = this.store.selectSignal<string | undefined>(getRouterSelectors().selectUrl);
  readonly title = this.store.selectSignal(getRouterSelectors().selectTitle);
  readonly fragment = this.store.selectSignal(getRouterSelectors().selectFragment);

  readonly routeParams = this.store.selectSignal(getRouterSelectors().selectRouteParams);
  readonly queryParams = this.store.selectSignal(getRouterSelectors().selectQueryParams);

  getCurrentNavigationState(): Record<string, unknown> {
    return this.router.currentNavigation()?.extras.state ?? {};
  }
}
