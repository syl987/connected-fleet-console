import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GenerateVehicleLogsOptions } from '../models/vehicle-log.models';
import { DashboardActions } from '../store/dashboard/dashboard.actions';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly store = inject(Store);

  startGeneratingLogs(options: GenerateVehicleLogsOptions): void {
    this.store.dispatch(DashboardActions.startGeneratingLogs({ options }));
  }

  stopGeneratingLogs(): void {
    this.store.dispatch(DashboardActions.stopGeneratingLogs());
  }
}
