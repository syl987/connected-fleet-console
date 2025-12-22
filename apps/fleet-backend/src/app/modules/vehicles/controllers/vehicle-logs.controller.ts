import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseDatePipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogSeverity } from '../../../common/entities/log.entity';
import { CreateVehicleLogDto } from '../../vehicles/dto/create-vehicle-log.dto';
import { VehicleLogDto } from '../../vehicles/dto/vehicle-log.dto';
import { toVehicleLogDto } from '../mappers/vehicle-log.mapper';
import { VehicleLogsService } from '../services/vehicle-logs.service';

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
    return toVehicleLogDto(log);
  }

  @Get()
  @ApiOperation({ summary: 'List vehicle logs with optional pagination and text search' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'engine' })
  @ApiQuery({ name: 'mileage', required: false, type: Number, example: 50000 })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2023 })
  @ApiQuery({ name: 'vehicle', required: false, type: Number, example: 24 })
  @ApiQuery({ name: 'severity', required: false, type: String, example: 'CRITICAL', enum: Object.values(LogSeverity) })
  @ApiQuery({ name: 'code', required: false, type: String, example: 'E123' })
  @ApiQuery({ name: 'from', required: false, type: Date, example: '2023-01-01T00:00:00Z' })
  @ApiQuery({ name: 'to', required: false, type: Date, example: '2026-11-30T23:59:59Z' })
  @ApiResponse({ status: 200, description: 'Vehicle log list', type: [VehicleLogDto] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('search') search?: string,
    @Query('vehicle', new ParseIntPipe({ optional: true })) vehicle?: number,
    @Query('mileage', new ParseIntPipe({ optional: true })) mileage?: number,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('severity', new ParseEnumPipe(Object.values(LogSeverity), { optional: true })) severity?: string,
    @Query('code') code?: string,
    @Query('from', new ParseDatePipe({ optional: true })) from?: Date,
    @Query('to', new ParseDatePipe({ optional: true })) to?: Date,
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
    return { data: items.map(toVehicleLogDto), total, page, size };
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get vehicle logs for a specific vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle logs', type: [VehicleLogDto] })
  async findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number): Promise<VehicleLogDto[]> {
    const logs = await this.vehicleLogsService.findByVehicle(vehicleId);
    return logs.map(toVehicleLogDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle log by id' })
  @ApiResponse({ status: 200, description: 'Vehicle log', type: VehicleLogDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleLogDto> {
    const log = await this.vehicleLogsService.findOne(id);
    return toVehicleLogDto(log);
  }
}
