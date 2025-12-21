import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LogSummary {
  totalLogs: number;
  uniqueVehicles: number;
  uniqueCodes: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
}

@Injectable({ providedIn: 'root' })
export class VehicleLogsAnalyticsService {
  protected readonly http = inject(HttpClient);

  readonly baseUrl = 'api/logs/analytics/vehicles';

  getSummary(): Observable<LogSummary> {
    const url = `${this.baseUrl}/summary`;

    return this.http.get<LogSummary>(url);
  }
}
