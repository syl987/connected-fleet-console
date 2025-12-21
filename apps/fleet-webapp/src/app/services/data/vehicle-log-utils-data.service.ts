import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateVehicleLogsOptions } from '../../models/vehicle-log.models';

@Injectable({ providedIn: 'root' })
export class VehicleLogUtilsDataService {
  protected readonly http = inject(HttpClient);

  readonly url = '/api/logs/utils/vehicles';

  startGeneratingLogs(body: GenerateVehicleLogsOptions): Observable<void> {
    const url = `${this.url}/generate/start`;

    return this.http.post<void>(url, body);
  }

  stopGeneratingLogs(): Observable<void> {
    const url = `${this.url}/generate/stop`;

    return this.http.post<void>(url, null);
  }
}
