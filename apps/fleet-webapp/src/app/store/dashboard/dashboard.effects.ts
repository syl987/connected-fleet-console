import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { exhaustMap, switchMap, tap } from 'rxjs';
import { VehicleLogUtilsDataService } from '../../services/data/vehicle-log-utils-data.service';
import { VehicleLogsAnalyticsStreamService } from '../../services/stream/vehicle-logs-analytics-stream.service';
import { ToastService } from '../../services/toast.service';
import { DashboardActions } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  protected readonly actions = inject(Actions);
  protected readonly toastService = inject(ToastService);
  protected readonly vehicleLogUtilsDataService = inject(VehicleLogUtilsDataService);
  protected readonly vehicleLogsAnalyticsStreamService = inject(VehicleLogsAnalyticsStreamService);

  readonly startGeneratingLogs = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.startGeneratingLogs),
      exhaustMap(({ options }) =>
        this.vehicleLogUtilsDataService.startGeneratingLogs(options).pipe(
          mapResponse({
            next: () => {
              const message = `Started generating vehicle logs for ${Math.ceil(options.duration / 60 / 1000)} minutes.`;
              this.toastService.showSuccessToast(message);
              return DashboardActions.startGeneratingLogsSUCCESS();
            },
            error: (e: unknown) => {
              if (e instanceof HttpErrorResponse) {
                if (e.status === 409) {
                  this.toastService.showErrorToast('Vehicle logs generation is already in progress.');
                  return DashboardActions.startGeneratingLogsERROR();
                }
              }
              this.toastService.showErrorToast('Error starting log generation.');
              return DashboardActions.startGeneratingLogsERROR();
            },
          }),
        ),
      ),
    );
  });

  readonly stopGeneratingLogs = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.stopGeneratingLogs),
      switchMap(() =>
        this.vehicleLogUtilsDataService.stopGeneratingLogs().pipe(
          mapResponse({
            next: () => {
              this.toastService.showSuccessToast('Stopped generating vehicle logs.');
              return DashboardActions.stopGeneratingLogsSUCCESS();
            },
            error: () => {
              this.toastService.showErrorToast('Error stopping log generation.');
              return DashboardActions.stopGeneratingLogsERROR();
            },
          }),
        ),
      ),
    );
  });

  readonly streamSummary = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.streamSummary),
      switchMap(() =>
        this.vehicleLogsAnalyticsStreamService.streamVehicleLogsSummary().pipe(
          mapResponse({
            next: (summary) => {
              return DashboardActions.streamSummaryNEXT({ summary });
            },
            error: () => {
              this.toastService.showErrorToast('Error streaming vehicle logs summary.');
              return DashboardActions.streamSummaryERROR();
            },
          }),
        ),
      ),
    );
  });

  readonly stopStreamingSummary = createEffect(
    () => {
      return this.actions.pipe(
        ofType(DashboardActions.streamSummarySTOP),
        tap(() => this.vehicleLogsAnalyticsStreamService.disconnect()),
      );
    },
    { dispatch: false },
  );
}
