import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { VehicleLogDataService } from '../../services/data/vehicle-log-data.service';
import { ToastService } from '../../services/toast.service';
import { VehicleLogService } from '../../services/vehicle-log.service';
import { VehicleLogActions } from './vehicle-log.actions';

@Injectable()
export class VehicleLogEffects {
  protected readonly actions = inject(Actions);
  protected readonly toastService = inject(ToastService);
  protected readonly vehicleLogDataService = inject(VehicleLogDataService);
  protected readonly vehicleLogService = inject(VehicleLogService);

  readonly loadVehicleLogs = createEffect(() => {
    return this.actions.pipe(
      ofType(VehicleLogActions.loadVehicleLogs),
      switchMap(({ vehicleId }) =>
        this.vehicleLogDataService.getByVehicleId(vehicleId).pipe(
          mapResponse({
            next: (logs) => {
              this.vehicleLogService.upsertManyInCache(logs);
              return VehicleLogActions.loadVehicleLogsSUCCESS({ vehicleId, logs });
            },
            error: () => {
              this.toastService.showErrorToast('Error loading vehicle logs.');
              return VehicleLogActions.loadVehicleLogsERROR();
            },
          }),
        )),
    );
  });
}
