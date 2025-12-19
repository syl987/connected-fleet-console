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

import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleDto } from '../dto/vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';
import { VehiclesService } from '../services/vehicles.service';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 201, description: 'Created vehicle', type: VehicleDto })
  async create(@Body() createDto: CreateVehicleDto): Promise<VehicleDto> {
    const v = await this.service.create(createDto);
    return this.toDto(v);
  }

  @Get()
  @ApiOperation({ summary: 'List vehicles with optional pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Vehicle list', type: [VehicleDto] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ): Promise<{ data: VehicleDto[]; total: number; page: number; size: number }> {
    const { items, total } = await this.service.findAll(page, size);
    return { data: items.map((v) => this.toDto(v)), total, page, size };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiResponse({ status: 200, description: 'Vehicle', type: VehicleDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleDto> {
    const v = await this.service.findOne(id);
    return this.toDto(v);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, description: 'Updated vehicle', type: VehicleDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehicleDto): Promise<VehicleDto> {
    const v = await this.service.update(id, dto);
    return this.toDto(v);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a vehicle' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted vehicle' })
  @ApiResponse({ status: 200, description: 'Restored vehicle', type: VehicleDto })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<VehicleDto> {
    const v = await this.service.restore(id);
    return this.toDto(v);
  }

  @Get('deleted')
  @ApiOperation({ summary: 'List soft-deleted vehicles' })
  @ApiResponse({ status: 200, description: 'Deleted vehicles', type: [VehicleDto] })
  async findDeleted(): Promise<VehicleDto[]> {
    const list = await this.service.findDeleted();
    return list.map((v) => this.toDto(v));
  }

  private toDto(v: Vehicle): VehicleDto {
    return {
      id: v.id,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
      deletedAt: v.deletedAt?.toISOString?.(),
      version: v.version,
      brand: v.brand,
      model: v.model,
      year: v.year,
      vin: v.vin,
      mileage: v.mileage,
      color: v.color,
      fuelType: v.fuelType,
    };
  }
}
