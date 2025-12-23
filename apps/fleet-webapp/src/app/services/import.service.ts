import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ImportActions } from '../store/import/import.actions';
import { importFeature } from '../store/import/import.reducer';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly store = inject(Store);

  readonly vehicleLogs$ = this.store.select(importFeature.selectAll);
  readonly loading$ = this.store.select(importFeature.selectLoading);
  readonly loaded$ = this.store.select(importFeature.selectLoaded);

  import(file: File): void {
    this.store.dispatch(ImportActions.importVehicleLogs({ file }));
  }

  clearVehicleLogs(): void {
    this.store.dispatch(ImportActions.clearVehicleLogs());
  }
}
