import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

export const loadVehiclesResolver: ResolveFn<void> = () => {
  inject(VehicleService).getAll();
  return; // return void to avoid blocking navigation
};
