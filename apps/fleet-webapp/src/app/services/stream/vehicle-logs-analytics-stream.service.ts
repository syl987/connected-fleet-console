import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  VehicleLogsColorStats,
  VehicleLogsSeverityStats,
  VehicleLogsSummary,
} from '../../models/vehicle-logs-analytics.models';

type VehicleLogsAnalyticsStreamResponse = {
  summary: VehicleLogsSummary;
  severityStats: VehicleLogsSeverityStats;
  colorStats: VehicleLogsColorStats;
};

@Injectable({
  providedIn: 'root',
})
export class VehicleLogsAnalyticsStreamService implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  private eventSource: EventSource | null = null;

  readonly url = 'api/logs/analytics/vehicles/stream';

  /**
   * Create an Observable stream of vehicle logs analytics
   * @param interval Polling interval in milliseconds (default: 5000)
   * @returns Observable that emits VehicleLogsSummary data
   */
  stream(interval = 5000): Observable<VehicleLogsAnalyticsStreamResponse> {
    this.disconnect();

    const url = `${this.url}?interval=${interval}`;

    return new Observable<VehicleLogsAnalyticsStreamResponse>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.addEventListener('analytics', (event: MessageEvent) => {
        try {
          observer.next(JSON.parse(event.data));
        } catch (error) {
          observer.error(error);
        }
      });
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        observer.error(error);
      };
      eventSource.onopen = () => {
        console.log('SSE connection established for vehicle logs summary');
      };
      this.eventSource = eventSource;

      return () => {
        eventSource.close();
        console.log('SSE connection closed');
      };
    }).pipe(takeUntil(this.destroyed$));
  }

  /**
   * Disconnect from the current SSE stream
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE connection closed');
    }
  }

  /**
   * Clean up on service destruction
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.disconnect();
  }
}
