import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GenerateVehicleLogsOptions } from '../models/vehicle-logs-utils.models';
import { DashboardActions } from '../store/dashboard/dashboard.actions';
import { dashboardFeature } from '../store/dashboard/dashboard.reducer';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly store = inject(Store);

  readonly summary$ = this.store.select(dashboardFeature.selectSummary);
  readonly severityStats$ = this.store.select(dashboardFeature.selectSeverityStats);
  readonly colorStats$ = this.store.select(dashboardFeature.selectColorStats);

  readonly streaming$ = this.store.select(dashboardFeature.selectStreaming);

  startGeneratingLogs(options: GenerateVehicleLogsOptions): void {
    this.store.dispatch(DashboardActions.startGeneratingLogs({ options }));
  }

  stopGeneratingLogs(): void {
    this.store.dispatch(DashboardActions.stopGeneratingLogs());
  }

  streamAnalytics(): void {
    this.store.dispatch(DashboardActions.streamAnalytics());
  }

  stopStreamingAnalytics(): void {
    this.store.dispatch(DashboardActions.streamAnalyticsSTOP());
  }
}
