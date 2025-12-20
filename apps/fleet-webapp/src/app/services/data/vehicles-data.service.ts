import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DefaultDataService, HttpOptions, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { map, Observable } from 'rxjs';
import { EntityType, Page } from '../../models/entity.models';
import { Vehicle } from '../../models/vehicle.models';

@Injectable({ providedIn: 'root' })
export class VehiclesDataService extends DefaultDataService<Vehicle> {
  constructor() {
    super(EntityType.Vehicle, inject(HttpClient), inject(HttpUrlGenerator));
  }

  override getAll(): Observable<Vehicle[]> {
    return (super.getAll() as unknown as Observable<Page<Vehicle>>).pipe(
      map(({ data }) => data), // unwrap data property from paginated API response
    );
  }

  override getWithQuery(queryParams: QueryParams | string | undefined, options?: HttpOptions): Observable<Vehicle[]> {
    return (super.getWithQuery(queryParams, options) as unknown as Observable<Page<Vehicle>>).pipe(
      map(({ data }) => data), // unwrap data property from paginated API response
    );
  }
}
