import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { VehicleLogUtilsDataService } from '../../services/data/vehicle-log-utils-data.service';
import { ToastService } from '../../services/toast.service';
import { VehicleLogService } from '../../services/vehicle-log.service';
import { ImportActions } from './import.actions';

@Injectable()
export class ImportEffects {
  protected readonly actions = inject(Actions);
  protected readonly toastService = inject(ToastService);
  protected readonly vehicleLogUtilsDataService = inject(VehicleLogUtilsDataService);
  protected readonly vehicleLogService = inject(VehicleLogService);

  readonly importVehicleLogs = createEffect(() => {
    return this.actions.pipe(
      ofType(ImportActions.importVehicleLogs),
      switchMap(({ file }) =>
        this.vehicleLogUtilsDataService.parseAndSave(file).pipe(
          mapResponse({
            next: (logs) => {
              this.toastService.showSuccessToast('Vehicle logs saved successfully.');
              this.vehicleLogService.upsertManyInCache(logs);
              return ImportActions.importVehicleLogsSUCCESS({ logs });
            },
            error: () => {
              this.toastService.showErrorToast('Error importing vehicle logs.');
              return ImportActions.importVehicleLogsERROR();
            },
          }),
        ),
      ),
    );
  });
}
