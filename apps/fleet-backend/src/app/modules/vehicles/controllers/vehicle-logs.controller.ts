import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseDatePipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleLogDto } from '../../vehicles/dto/create-vehicle-log.dto';
import { VehicleLogDto } from '../../vehicles/dto/vehicle-log.dto';
import { VehicleLog } from '../../vehicles/entities/vehicle-log.entity';
import { VehicleLogsService } from '../services/vehicle-logs.service';

const SEVERITY_VALUES = [
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
];

@ApiTags('Logs')
@Controller('logs/vehicles')
export class VehicleLogsController {
  constructor(private readonly vehicleLogsService: VehicleLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a vehicle log' })
  @ApiBody({ type: CreateVehicleLogDto })
  @ApiResponse({ status: 201, description: 'Created vehicle log', type: VehicleLogDto })
  async create(@Body() createDto: CreateVehicleLogDto): Promise<VehicleLogDto> {
    const log = await this.vehicleLogsService.create(createDto);
    return this.toDto(log);
  }

  @Get()
  @ApiOperation({ summary: 'List vehicle logs with optional pagination and text search' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'engine' })
  @ApiQuery({ name: 'mileage', required: false, type: Number, example: 50000 })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2023 })
  @ApiQuery({ name: 'vehicle', required: false, type: Number, example: 24 })
  @ApiQuery({ name: 'severity', required: false, type: String, example: 'CRITICAL', enum: SEVERITY_VALUES })
  @ApiQuery({ name: 'code', required: false, type: String, example: 'E123' })
  @ApiQuery({ name: 'from', required: false, type: Date, example: '2023-01-01T00:00:00Z' })
  @ApiQuery({ name: 'to', required: false, type: Date, example: '2026-11-30T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Vehicle log list', type: [VehicleLogDto] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('search') search?: string,
    @Query('vehicle') vehicle?: string,
    @Query('mileage') mileage?: string,
    @Query('year') year?: string,
    @Query('severity') severity?: string,
    @Query('code') code?: string,
    @Query('from', ParseDatePipe) from?: Date,
    @Query('to', ParseDatePipe) to?: Date,
  ): Promise<{ data: VehicleLogDto[]; total: number; page: number; size: number }> {
    const { items, total } = await this.vehicleLogsService.findAll(
      page,
      size,
      search,
      mileage,
      year,
      vehicle,
      severity,
      code,
      from,
      to,
    );
    return { data: items.map((log) => this.toDto(log)), total, page, size };
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get vehicle logs for a specific vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle logs', type: [VehicleLogDto] })
  async findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number): Promise<VehicleLogDto[]> {
    const logs = await this.vehicleLogsService.findByVehicle(vehicleId);
    return logs.map((log) => this.toDto(log));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle log by id' })
  @ApiResponse({ status: 200, description: 'Vehicle log', type: VehicleLogDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleLogDto> {
    const log = await this.vehicleLogsService.findOne(id);
    return this.toDto(log);
  }

  private toDto(log: VehicleLog): VehicleLogDto {
    return {
      id: log.id,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
      deletedAt: log.deletedAt?.toISOString(),
      version: log.version,
      timestamp: log.timestamp.toISOString(),
      severity: log.severity,
      code: log.code,
      message: log.message,
      vehicleId: log.vehicle.id,
    };
  }
}
