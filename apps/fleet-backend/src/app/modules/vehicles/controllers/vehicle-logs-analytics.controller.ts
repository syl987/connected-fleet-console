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

const GROUPBY_VALUES = [
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
  @ApiResponse({
    status: 200,
    description: 'Log summary statistics',
    schema: {
      type: 'object',
      properties: {
        totalLogs: { type: 'number', example: 1500 },
        bySeverity: {
          type: 'object',
          example: { DEBUG: 500, INFO: 400, WARNING: 300, ERROR: 200, CRITICAL: 100 },
        },
        uniqueVehicles: { type: 'number', example: 25 },
        uniqueCodes: { type: 'number', example: 42 },
        dateRange: {
          type: 'object',
          properties: {
            earliest: { type: 'string', format: 'date-time' },
            latest: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('severity-distribution')
  @ApiOperation({ summary: 'Get log count distribution by severity level' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiQuery({ name: 'vehicle', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Severity distribution',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', example: 'ERROR' },
          count: { type: 'number', example: 150 },
          percentage: { type: 'number', example: 15.5 },
        },
      },
    },
  })
  async getSeverityDistribution(
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
    @Query('vehicle', new DefaultValuePipe(null), ParseIntPipe) vehicleId?: number,
  ) {
    return this.analyticsService.getSeverityDistribution(from, to, vehicleId);
  }

  @Get('top-errors')
  @ApiOperation({ summary: 'Get most frequent error codes' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'severity', required: false, enum: SEVERITY_VALUES })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Top error codes',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'number', example: 1234 },
          count: { type: 'number', example: 42 },
          severity: { type: 'string', example: 'ERROR' },
          lastOccurrence: { type: 'string', format: 'date-time' },
          affectedVehicles: { type: 'number', example: 5 },
        },
      },
    },
  })
  async getTopErrors(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('severity', new DefaultValuePipe(null), new ParseEnumPipe(SEVERITY_VALUES, { optional: true }))
    severity?: string,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getTopErrors(limit, severity, from, to);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get log count over time' })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['hour', 'day', 'month'], example: 'day' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiQuery({ name: 'severity', required: false, enum: SEVERITY_VALUES })
  @ApiQuery({ name: 'vehicle', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Timeline data',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          period: { type: 'string', example: '2025-12-21' },
          count: { type: 'number', example: 125 },
          bySeverity: {
            type: 'object',
            example: { DEBUG: 50, INFO: 40, WARNING: 20, ERROR: 10, CRITICAL: 5 },
          },
        },
      },
    },
  })
  async getTimeline(
    @Query('groupBy', new DefaultValuePipe('day'), new ParseEnumPipe(['hour', 'day', 'month'])) groupBy: string,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
    @Query('severity', new DefaultValuePipe(null), new ParseEnumPipe(SEVERITY_VALUES, { optional: true }))
    severity?: string,
    @Query('vehicle', new DefaultValuePipe(null), ParseIntPipe) vehicleId?: number,
  ) {
    return this.analyticsService.getTimeline(groupBy, from, to, severity, vehicleId);
  }

  @Get('vehicle-health')
  @ApiOperation({ summary: 'Get vehicle health metrics based on log patterns' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Vehicle health metrics',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          vehicleId: { type: 'number', example: 1 },
          vehicleName: { type: 'string', example: 'Toyota Camry' },
          vin: { type: 'string', example: '1HGBH41JXMN109186' },
          totalLogs: { type: 'number', example: 45 },
          criticalCount: { type: 'number', example: 2 },
          errorCount: { type: 'number', example: 8 },
          warningCount: { type: 'number', example: 15 },
          healthScore: { type: 'number', example: 72.5 },
          status: { type: 'string', enum: ['healthy', 'warning', 'critical'], example: 'warning' },
          lastLogTimestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getVehicleHealth(
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getVehicleHealth(from, to);
  }

  @Get('code-patterns')
  @ApiOperation({ summary: 'Analyze error code patterns and correlations' })
  @ApiQuery({ name: 'code', required: false, type: Number, description: 'Specific error code to analyze' })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Code pattern analysis',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 1234 },
        totalOccurrences: { type: 'number', example: 42 },
        correlatedCodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'number', example: 5678 },
              coOccurrences: { type: 'number', example: 15 },
              correlation: { type: 'number', example: 0.75 },
            },
          },
        },
        avgTimeBetweenOccurrences: { type: 'string', example: '2h 15m' },
        peakHours: { type: 'array', items: { type: 'number' }, example: [14, 15, 16] },
      },
    },
  })
  async getCodePatterns(
    @Query('code', new DefaultValuePipe(null), ParseIntPipe) code?: number,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getCodePatterns(code, from, to);
  }

  @Get('aggregations')
  @ApiOperation({ summary: 'Get aggregated log counts by specified dimension' })
  @ApiQuery({ name: 'groupBy', required: true, enum: GROUPBY_VALUES })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'from', required: false, type: Date })
  @ApiQuery({ name: 'to', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Aggregated data',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'ERROR' },
          count: { type: 'number', example: 150 },
          percentage: { type: 'number', example: 15.5 },
        },
      },
    },
  })
  async getAggregations(
    @Query('groupBy', new ParseEnumPipe(GROUPBY_VALUES)) groupBy: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('from', new DefaultValuePipe(null), new ParseDatePipe()) from?: Date,
    @Query('to', new DefaultValuePipe(null), new ParseDatePipe()) to?: Date,
  ) {
    return this.analyticsService.getAggregations(groupBy, limit, from, to);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Identify trends and anomalies in log patterns' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiQuery({ name: 'severity', required: false, enum: SEVERITY_VALUES })
  @ApiResponse({
    status: 200,
    description: 'Trend analysis',
    schema: {
      type: 'object',
      properties: {
        overallTrend: { type: 'string', enum: ['increasing', 'decreasing', 'stable'], example: 'increasing' },
        changeRate: { type: 'number', example: 12.5 },
        anomalies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date' },
              count: { type: 'number', example: 350 },
              expected: { type: 'number', example: 120 },
              deviation: { type: 'number', example: 2.5 },
            },
          },
        },
        predictions: {
          type: 'object',
          properties: {
            nextDay: { type: 'number', example: 125 },
            nextWeek: { type: 'number', example: 875 },
          },
        },
      },
    },
  })
  async getTrends(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
    @Query('severity', new DefaultValuePipe(null), new ParseEnumPipe(SEVERITY_VALUES, { optional: true }))
    severity?: string,
  ) {
    return this.analyticsService.getTrends(days, severity);
  }
}
