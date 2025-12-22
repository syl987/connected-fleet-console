import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { VehicleLogsSummary } from '../../models/vehicle-log.models';

@Injectable({
  providedIn: 'root',
})
export class VehicleLogsAnalyticsStreamService implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  private eventSource: EventSource | null = null;

  readonly url = 'api/logs/stream/vehicles/analytics';

  /**
   * Create an Observable stream of vehicle logs summary
   * @param interval Polling interval in milliseconds (default: 5000)
   * @returns Observable that emits VehicleLogsSummary data
   */
  streamVehicleLogsSummary(interval = 5000): Observable<VehicleLogsSummary> {
    const url = `${this.url}/summary?interval=${interval}`;

    return new Observable<VehicleLogsSummary>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.addEventListener('summary', (event: MessageEvent) => {
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
