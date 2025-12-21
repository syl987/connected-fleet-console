import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { VehicleLogDto } from '../dto/vehicle-log.dto';
import { VehicleLogsService } from '../services/vehicle-logs.service';

@ApiTags('Logs')
@Controller('logs/utils/vehicles')
export class VehicleLogsUtilsController {
  constructor(private readonly vehicleLogsService: VehicleLogsService) {}

  @Post('generate/start')
  @ApiOperation({ summary: 'Generate vehicle logs in real-time for a specified duration.' })
  @ApiBody({ type: CreateVehicleLogDto })
  @ApiResponse({ status: 201, description: 'Triggered vehicle logs generation', type: VehicleLogDto })
  async generateStart(@Body() createDto: CreateVehicleLogDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
