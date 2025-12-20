import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpParams } from '../../helpers/http.helpers';
import { Page } from '../../models/entity.models';
import { Log, SearchLogsParams } from '../../models/log.models';

@Injectable({ providedIn: 'root' })
export class LogsDataService {
  protected readonly http = inject(HttpClient);

  readonly url = 'api/logs';

  search(params: SearchLogsParams): Observable<Page<Log>> {
    return this.http.get<Page<Log>>(this.url, {
      params: toHttpParams(params),
    });
  }
}
