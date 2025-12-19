import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { UpdateVehicleLogDto } from '../dto/update-vehicle-log.dto';
import { VehicleLogDto } from '../dto/vehicle-log.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { LogsService } from '../services/logs.service';

@ApiTags('Logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a vehicle log' })
  @ApiBody({ type: CreateVehicleLogDto })
  @ApiResponse({ status: 201, description: 'Created vehicle log', type: VehicleLogDto })
  async create(@Body() createDto: CreateVehicleLogDto): Promise<VehicleLogDto> {
    const log = await this.service.create(createDto);
    return this.toDto(log);
  }

  @Get()
  @ApiOperation({ summary: 'List vehicle logs with optional pagination and vehicle filter' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'vehicleId', required: false, type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Vehicle log list', type: [VehicleLogDto] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('vehicleId') vehicleId?: number,
  ): Promise<{ data: VehicleLogDto[]; total: number; page: number; size: number }> {
    const { items, total } = await this.service.findAll(page, size, vehicleId ? Number(vehicleId) : undefined);
    return { data: items.map((log) => this.toDto(log)), total, page, size };
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get all logs for a specific vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle logs', type: [VehicleLogDto] })
  async findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number): Promise<VehicleLogDto[]> {
    const logs = await this.service.findByVehicle(vehicleId);
    return logs.map((log) => this.toDto(log));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle log by id' })
  @ApiResponse({ status: 200, description: 'Vehicle log', type: VehicleLogDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleLogDto> {
    const log = await this.service.findOne(id);
    return this.toDto(log);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle log' })
  @ApiBody({ type: UpdateVehicleLogDto })
  @ApiResponse({ status: 200, description: 'Updated vehicle log', type: VehicleLogDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleLogDto): Promise<VehicleLogDto> {
    const log = await this.service.update(id, dto);
    return this.toDto(log);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a vehicle log' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted vehicle log' })
  @ApiResponse({ status: 200, description: 'Restored vehicle log', type: VehicleLogDto })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<VehicleLogDto> {
    const log = await this.service.restore(id);
    return this.toDto(log);
  }

  @Get('deleted/all')
  @ApiOperation({ summary: 'List soft-deleted vehicle logs' })
  @ApiResponse({ status: 200, description: 'Deleted vehicle logs', type: [VehicleLogDto] })
  async findDeleted(): Promise<VehicleLogDto[]> {
    const logs = await this.service.findDeleted();
    return logs.map((log) => this.toDto(log));
  }

  private toDto(log: VehicleLog): VehicleLogDto {
    return {
      id: log.id,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
      deletedAt: log.deletedAt?.toISOString?.(),
      version: log.version,
      timestamp: log.timestamp.toISOString(),
      severity: log.severity,
      code: log.code,
      message: log.message,
      vehicleId: log.vehicle.id,
    };
  }
}
