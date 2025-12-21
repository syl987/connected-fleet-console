import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { exhaustMap } from 'rxjs';
import { VehicleLogUtilsDataService } from '../../services/data/vehicle-log-utils-data.service';
import { ToastService } from '../../services/toast.service';
import { DashboardActions } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  protected readonly actions = inject(Actions);
  protected readonly toastService = inject(ToastService);
  protected readonly vehicleLogUtilsDataService = inject(VehicleLogUtilsDataService);

  readonly startGeneratingLogs = createEffect(() => {
    return this.actions.pipe(
      ofType(DashboardActions.startGeneratingLogs),
      exhaustMap(({ options }) =>
        this.vehicleLogUtilsDataService.startGeneratingLogs(options).pipe(
          mapResponse({
            next: () => {
              const message = `Started generating vehicle logs for ${options.duration} seconds.`;
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
      exhaustMap(() =>
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
}
