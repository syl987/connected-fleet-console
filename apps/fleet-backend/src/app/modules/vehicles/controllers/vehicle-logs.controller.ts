import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleLogDto } from '../../vehicles/dto/create-vehicle-log.dto';
import { VehicleLogDto } from '../../vehicles/dto/vehicle-log.dto';
import { VehicleLog } from '../../vehicles/entities/vehicle-log.entity';
import { VehicleLogsService } from '../services/vehicle-logs.service';

@ApiTags('Vehicle Logs')
@Controller('logs')
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
  @ApiOperation({ summary: 'List vehicle logs with optional pagination, vehicle filter, and text search' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'engine' })
  @ApiResponse({ status: 200, description: 'Vehicle log list', type: [VehicleLogDto] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('search') search?: string,
  ): Promise<{ data: VehicleLogDto[]; total: number; page: number; size: number }> {
    const { items, total } = await this.vehicleLogsService.findAll(page, size, search);
    return { data: items.map((log) => this.toDto(log)), total, page, size };
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get all logs for a specific vehicle' })
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
