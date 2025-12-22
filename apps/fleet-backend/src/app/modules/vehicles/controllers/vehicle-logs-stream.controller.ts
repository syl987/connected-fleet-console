import { Controller, DefaultValuePipe, Logger, ParseIntPipe, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { interval, Observable } from 'rxjs';
import { VehicleLogsSummaryDto } from '../dto/vehicle-logs-summary.dto';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

@ApiTags('Logs Stream')
@Controller('logs/stream/vehicles')
export class VehicleLogsStreamController {
  private readonly logger = new Logger(VehicleLogsStreamController.name);

  constructor(private readonly vehicleLogsAnalyticsService: VehicleLogsAnalyticsService) {}

  @Sse('summary')
  @ApiOperation({ summary: 'Stream vehicle logs summary in real-time using Server-Sent Events' })
  @ApiQuery({ name: 'interval', required: false, type: Number, example: 5000, description: 'Polling interval in ms' })
  @ApiResponse({ status: 200, description: 'SSE stream of vehicle logs summary' })
  getSummary(
    @Query('interval', new DefaultValuePipe(5000), ParseIntPipe) intervalMs: number,
  ): Observable<VehicleLogsSummaryDto> {
    this.logger.log(`Starting vehicle logs summary SSE stream with ${intervalMs}ms interval`);

    return new Observable<VehicleLogsSummaryDto>((observer) => {
      const subscription = interval(intervalMs).subscribe(async () => {
        try {
          const summary = await this.vehicleLogsAnalyticsService.getSummary();
          this.logger.log(summary);

          observer.next(summary);
        } catch (error) {
          this.logger.error('Error streaming vehicle logs summary:', error);
        }
        return () => subscription.unsubscribe();
      });
    });
  }
}
