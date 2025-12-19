import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

export const loadVehiclesResolver: ResolveFn<void> = () => {
  inject(VehicleService).getWithQuery({ size: Number.MAX_SAFE_INTEGER }); // do not return anything to avoid blocking the route
};
