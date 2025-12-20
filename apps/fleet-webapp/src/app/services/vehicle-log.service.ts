import { inject, Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { EntityType } from '../models/entity.models';
import { VehicleLog } from '../models/log.models';

@Injectable({
  providedIn: 'root',
})
export class VehicleLogService extends EntityCollectionServiceBase<VehicleLog> {
  constructor() {
    super(EntityType.VehicleLog, inject(EntityCollectionServiceElementsFactory));
  }
}
