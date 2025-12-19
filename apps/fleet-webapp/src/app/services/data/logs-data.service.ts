import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpParams } from '../../helpers/http.helpers';
import { Log, SearchLogsParams } from '../../models/log.models';

@Injectable({ providedIn: 'root' })
export class LogsDataService {
  protected readonly http = inject(HttpClient);

  readonly url = 'api/logs/vehicles';

  search(params: SearchLogsParams): Observable<Log[]> {
    return this.http.get<Log[]>(this.url, {
      params: toHttpParams(params),
    });
  }
}
