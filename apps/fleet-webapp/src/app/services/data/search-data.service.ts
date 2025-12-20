import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpParams } from '../../helpers/http.helpers';
import { Page } from '../../models/entity.models';
import { SearchLogsParams, VehicleLog } from '../../models/log.models';

@Injectable({ providedIn: 'root' })
export class SearchDataService {
  protected readonly http = inject(HttpClient);

  readonly url = '/api/logs/vehicles';

  search(params: SearchLogsParams): Observable<Page<VehicleLog>> {
    return this.http.get<Page<VehicleLog>>(this.url, {
      params: toHttpParams(params),
    });
  }
}
