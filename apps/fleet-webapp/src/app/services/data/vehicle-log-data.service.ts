import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpParams } from '../../helpers/http.helpers';
import { Page } from '../../models/entity.models';
import { SearchVehicleLogsParams } from '../../models/search.models';
import { VehicleLog } from '../../models/vehicle-log.models';

@Injectable({ providedIn: 'root' })
export class VehicleLogDataService {
  protected readonly http = inject(HttpClient);

  readonly url = '/api/logs/vehicles';

  create(log: Partial<VehicleLog>): Observable<VehicleLog> {
    return this.http.post<VehicleLog>(this.url, log);
  }

  getBySearchParams(params: SearchVehicleLogsParams): Observable<Page<VehicleLog>> {
    return this.http.get<Page<VehicleLog>>(this.url, {
      params: toHttpParams(params),
    });
  }

  getByVehicleId(vehicleId: number): Observable<VehicleLog[]> {
    const url = `${this.url}/vehicle/${vehicleId}`;

    return this.http.get<VehicleLog[]>(url);
  }

  getById(id: number): Observable<VehicleLog> {
    const url = `${this.url}/${id}`;

    return this.http.get<VehicleLog>(url);
  }
}
