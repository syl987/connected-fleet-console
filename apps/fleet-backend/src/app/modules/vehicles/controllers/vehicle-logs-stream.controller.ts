import { Controller, DefaultValuePipe, Logger, MessageEvent, ParseIntPipe, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { interval, Observable, startWith } from 'rxjs';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

@ApiTags('Logs Analytics Stream')
@Controller('logs/stream/vehicles/analytics')
export class VehicleLogsStreamController {
  private readonly logger = new Logger(VehicleLogsStreamController.name);

  constructor(private readonly vehicleLogsAnalyticsService: VehicleLogsAnalyticsService) {}

  @Sse('summary')
  @ApiOperation({ summary: 'Stream vehicle logs summary in real-time using Server-Sent Events' })
  @ApiQuery({ name: 'interval', required: false, type: Number, example: 5000, description: 'Polling interval in ms' })
  @ApiResponse({ status: 200, description: 'SSE stream of vehicle logs summary' })
  getSummary(
    @Query('interval', new DefaultValuePipe(5000), ParseIntPipe) intervalMs: number,
  ): Observable<MessageEvent> {
    this.logger.log(`Starting vehicle logs summary SSE stream with ${intervalMs}ms interval`);

    return new Observable<MessageEvent>((observer) => {
      const subscription = interval(intervalMs)
        .pipe(startWith(-1)) // emit immediately on subscription
        .subscribe(async () => {
          try {
            const summary = await this.vehicleLogsAnalyticsService.getSummary();

            observer.next({
              data: JSON.stringify(summary),
              type: 'summary',
              id: Date.now().toString(),
              retry: intervalMs,
            } as MessageEvent);
          } catch (error) {
            this.logger.error('Error streaming vehicle logs summary:', error);
          }
        });
      return () => subscription.unsubscribe();
    });
  }
}
