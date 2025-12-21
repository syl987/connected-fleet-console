import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

@ApiTags('Logs Analytics')
@Controller('logs/analytics/vehicles')
export class VehicleLogsAnalyticsController {
  constructor(private readonly analyticsService: VehicleLogsAnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get overall log summary statistics' })
  @ApiResponse({ status: 200, description: 'Log summary statistics' })
  async getSummary() {
    return this.analyticsService.getSummary();
  }
}
