import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleLogsColorStatsDto } from '../dto/vehicle-logs-color-stats.dto';
import { VehicleLogsSeverityStatsDto } from '../dto/vehicle-logs-severity-stats.dto';
import { VehicleLogsSummaryDto } from '../dto/vehicle-logs-summary.dto';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

@ApiTags('Logs Analytics')
@Controller('logs/analytics/vehicles')
export class VehicleLogsAnalyticsController {
  private readonly logger = new Logger(VehicleLogsAnalyticsController.name);

  constructor(private readonly vehicleLogsAnalyticsService: VehicleLogsAnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get vehicle logs summary' })
  @ApiResponse({ status: 200, description: 'Get vehicle logs summary' })
  getSummary(): Promise<VehicleLogsSummaryDto> {
    return this.vehicleLogsAnalyticsService.getSummary();
  }

  @Get('severity-stats')
  @ApiOperation({ summary: 'Get aggregated vehicle logs by severity level' })
  @ApiResponse({ status: 200, description: 'Aggregated severity stats' })
  getSeverityStats(): Promise<VehicleLogsSeverityStatsDto> {
    return this.vehicleLogsAnalyticsService.getSeverityStats();
  }

  @Get('color-stats')
  @ApiOperation({ summary: 'Get aggregated vehicle logs by color' })
  @ApiResponse({ status: 200, description: 'Aggregated color stats' })
  getColorStats(): Promise<VehicleLogsColorStatsDto> {
    return this.vehicleLogsAnalyticsService.getColorStats();
  }
}
