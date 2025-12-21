import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchVehicleLogsParams } from '../models/search.models';
import { SearchActions } from '../store/search/search.actions';
import { searchFeature } from '../store/search/search.reducer';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly store = inject(Store);

  readonly vehicleLogs$ = this.store.select(searchFeature.selectAll);
  readonly page$ = this.store.select(searchFeature.selectPage);
  readonly size$ = this.store.select(searchFeature.selectSize);
  readonly total$ = this.store.select(searchFeature.selectTotal);
  readonly loading$ = this.store.select(searchFeature.selectLoading);
  readonly loaded$ = this.store.select(searchFeature.selectLoaded);

  search(params: SearchVehicleLogsParams): void {
    this.store.dispatch(SearchActions.searchVehicleLogs({ params }));
  }

  clearVehicleLogs(): void {
    this.store.dispatch(SearchActions.clearVehicleLogs());
  }
}
