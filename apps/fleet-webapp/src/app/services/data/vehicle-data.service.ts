import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { EntityType } from '../../models/entity.models';
import { Vehicle } from '../../models/vehicle.models';

@Injectable({ providedIn: 'root' })
export class VehicleDataService extends DefaultDataService<Vehicle> {
  constructor() {
    super(EntityType.Vehicle, inject(HttpClient), inject(HttpUrlGenerator));
  }
}
