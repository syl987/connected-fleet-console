import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'List vehicles' })
  @ApiResponse({ status: 200, description: 'Vehicle list', type: [VehicleDto] })
  async findAll(): Promise<VehicleDto[]> {
    const list = await this.service.findAll();
    return list.map(v => this.toDto(v));
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
  @ApiOperation({ summary: 'Delete a vehicle' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }

  private toDto(v: Vehicle): VehicleDto {
    return {
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      vin: v.vin,
      mileage: v.mileage,
      createdAt: v.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: v.updatedAt?.toISOString?.() ?? new Date().toISOString(),
      version: v.version,
    };
  }
}
