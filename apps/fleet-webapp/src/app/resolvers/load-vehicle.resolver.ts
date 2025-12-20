import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

export const loadVehicleResolver: ResolveFn<void> = ({ params }) => {
  inject(VehicleService).getByKey(params['id']);
  return; // return void to avoid blocking navigation
};
