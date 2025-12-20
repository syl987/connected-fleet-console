import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpParams } from '../../helpers/http.helpers';
import { SearchLogsParams, VehicleLog } from '../../models/log.models';

@Injectable({ providedIn: 'root' })
export class LogsDataService {
  protected readonly http = inject(HttpClient);

  readonly url = 'api/logs/vehicles';

  search(params: SearchLogsParams): Observable<VehicleLog[]> {
    return this.http.get<VehicleLog[]>(this.url, {
      params: toHttpParams(params),
    });
  }
}
