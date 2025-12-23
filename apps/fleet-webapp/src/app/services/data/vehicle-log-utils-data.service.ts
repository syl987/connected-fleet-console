import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleLog } from '../../models/vehicle-log.models';
import { GenerateVehicleLogsOptions } from '../../models/vehicle-logs-utils.models';

@Injectable({ providedIn: 'root' })
export class VehicleLogUtilsDataService {
  protected readonly http = inject(HttpClient);

  readonly url = '/api/logs/utils/vehicles';

  parseAndSave(file: File): Observable<VehicleLog[]> {
    const url = `${this.url}/parse-and-save`;

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<VehicleLog[]>(url, formData);
  }

  startGeneratingLogs(body: GenerateVehicleLogsOptions): Observable<void> {
    const url = `${this.url}/generate/start`;

    return this.http.post<void>(url, body);
  }

  stopGeneratingLogs(): Observable<void> {
    const url = `${this.url}/generate/stop`;

    return this.http.post<void>(url, null);
  }
}
