import { inject, Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { getRouterSelectors } from '@ngrx/router-store';
import { combineLatest, map } from 'rxjs';
import { EntityType } from '../models/entity.models';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService extends EntityCollectionServiceBase<Vehicle> {
  readonly routeId$ = this.store.select(getRouterSelectors().selectRouteParam('id'));

  readonly entityByRouteId$ = combineLatest([this.routeId$, this.entityMap$]).pipe(map(([id, entityMap]) => (id ? entityMap[id] : undefined)));

  constructor() {
    super(EntityType.Vehicle, inject(EntityCollectionServiceElementsFactory));
  }
}
