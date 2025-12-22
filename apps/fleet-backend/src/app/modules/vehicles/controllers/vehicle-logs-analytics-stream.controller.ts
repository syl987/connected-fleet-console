import { Controller, DefaultValuePipe, Logger, MessageEvent, ParseIntPipe, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { interval, Observable, startWith } from 'rxjs';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

const SEVERITY_VALUES = [
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
];

@ApiTags('Logs Analytics Stream')
@Controller('logs/analytics/vehicles/stream')
export class VehicleLogsAnalyticsStreamController {
  private readonly logger = new Logger(VehicleLogsAnalyticsStreamController.name);

  constructor(private readonly vehicleLogsAnalyticsService: VehicleLogsAnalyticsService) {}

  @Sse()
  @ApiOperation({ summary: 'Stream a collection of vehicle logs analytics' })
  @ApiQuery({ name: 'interval', required: false, type: Number, example: 5000, description: 'Polling interval in ms' })
  @ApiQuery({ name: 'severity', required: false, type: String, example: 'CRITICAL', enum: SEVERITY_VALUES })
  @ApiResponse({ status: 200, description: 'SSE stream of vehicle logs analytics' })
  getSummary(
    @Query('interval', new DefaultValuePipe(5000), ParseIntPipe) intervalMs: number,
    @Query('severity') severity?: string,
  ): Observable<MessageEvent> {
    this.logger.log(`Starting vehicle logs analytics SSE stream with ${intervalMs}ms interval`);

    return new Observable<MessageEvent>((observer) => {
      const subscription = interval(intervalMs)
        .pipe(startWith(-1)) // emit immediately on subscription
        .subscribe(async () => {
          try {
            const summary = await this.vehicleLogsAnalyticsService.getSummary();
            const severityStats = await this.vehicleLogsAnalyticsService.getSeverityStats();
            const colorStats = await this.vehicleLogsAnalyticsService.getColorStats(severity);

            observer.next({
              data: JSON.stringify({ summary, severityStats, colorStats }),
              type: 'analytics',
              id: Date.now().toString(),
              retry: intervalMs,
            } as MessageEvent);
          } catch (error) {
            this.logger.error('Error streaming vehicle logs analytics:', error);
          }
        });
      return () => subscription.unsubscribe();
    });
  }
}
