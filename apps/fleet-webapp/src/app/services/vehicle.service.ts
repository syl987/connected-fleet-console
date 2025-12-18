import { inject, Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { EntityType } from '../models/entity.models';
import { Vehicle } from '../modules/vehicles/models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService extends EntityCollectionServiceBase<Vehicle> {
  constructor() {
    super(EntityType.Vehicle, inject(EntityCollectionServiceElementsFactory));
  }
}
