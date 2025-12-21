import { Controller, DefaultValuePipe, Get, ParseDatePipe, ParseEnumPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleLogsAnalyticsService } from '../services/vehicle-logs-analytics.service';

const SEVERITY_VALUES = [
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
];

const GROUP_BY_VALUES = [
  'severity',
  'code',
  'vehicle',
  'hour',
  'day',
  'month',
];

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

  @Get('severity-distribution')
  @ApiOperation({ summary: 'Get log count distribution by severity level' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiQuery({ name: 'vehicle', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Severity distribution' })
  async getSeverityDistribution(
    @Query('vehicle', new DefaultValuePipe(null), new ParseIntPipe()) vehicleId?: number,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getSeverityDistribution(from, to, vehicleId);
  }

  @Get('top-errors')
  @ApiOperation({ summary: 'Get most frequent error codes' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'severity', required: false, enum: SEVERITY_VALUES })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Top error codes' })
  async getTopErrors(
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
    @Query('severity', new DefaultValuePipe(null), new ParseEnumPipe(SEVERITY_VALUES, { optional: true }))
    severity?: string,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getTopErrors(limit, severity, from, to);
  }

  @Get('vehicle-health')
  @ApiOperation({ summary: 'Get vehicle health metrics based on log patterns' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Vehicle health metrics' })
  async getVehicleHealth(
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getVehicleHealth(from, to);
  }

  @Get('aggregations')
  @ApiOperation({ summary: 'Get aggregated log counts by specified dimension' })
  @ApiQuery({ name: 'groupBy', required: true, enum: GROUP_BY_VALUES })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Aggregated data' })
  async getAggregations(
    @Query('groupBy', new ParseEnumPipe(GROUP_BY_VALUES)) groupBy: string,
    @Query('limit', new DefaultValuePipe(20), new ParseIntPipe()) limit: number,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getAggregations(groupBy, limit, from, to);
  }
}
