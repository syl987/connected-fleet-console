import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { VehicleLogActions } from '../store/vehicle-logs/vehicle-log.actions';

export const loadVehicleLogsResolver: ResolveFn<void> = ({ params }, _, store = inject(Store)) => {
  store.dispatch(VehicleLogActions.loadVehicleLogs({ vehicleId: Number(params['id']) }));
  return; // return void to avoid blocking navigation
};
