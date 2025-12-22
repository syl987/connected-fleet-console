import { inject, Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { getRouterSelectors } from '@ngrx/router-store';
import { map, switchMap } from 'rxjs';
import { EntityType } from '../models/entity.models';
import { VehicleLog } from '../models/vehicle-log.models';
import { vehicleLogsFeature } from '../store/vehicle-logs/vehicle-log.reducer';

@Injectable({
  providedIn: 'root',
})
export class VehicleLogService extends EntityCollectionServiceBase<VehicleLog> {
  readonly routeId$ = this.store.select(getRouterSelectors().selectRouteParam('id'));

  readonly entitiesByRouteId$ = this.routeId$.pipe(
    switchMap((vehicleId) => (vehicleId ? this.store.select(vehicleLogsFeature.selectAllByVehicleId(vehicleId)) : [])),
    map((logs) => logs ?? []),
  );

  readonly vehicleLogsLoading$ = this.store.select(vehicleLogsFeature.selectLoading);

  constructor() {
    super(EntityType.VehicleLog, inject(EntityCollectionServiceElementsFactory));
  }
}
