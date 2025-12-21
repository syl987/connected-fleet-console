import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateVehicleLogsDto } from '../dto/generate-vehicle-logs.dto';
import { VehicleLogsUtilsService } from '../services/vehicle-logs-utils.service';

@ApiTags('Logs Utilities')
@Controller('logs/utils/vehicles')
export class VehicleLogsUtilsController {
  constructor(private readonly vehicleLogsUtilsService: VehicleLogsUtilsService) {}

  @Post('generate/start')
  @ApiOperation({ summary: 'Start generating vehicle logs in real-time for a specified duration.' })
  @ApiBody({ type: GenerateVehicleLogsDto })
  @ApiResponse({ status: 200, description: 'Triggered vehicle logs generation' })
  @ApiResponse({ status: 409, description: 'Vehicle logs generation is already in progress' })
  startGeneratingLogs(@Body() generateDto: GenerateVehicleLogsDto): void {
    this.vehicleLogsUtilsService.startGeneratingLogs(generateDto);
  }

  @Post('generate/stop')
  @ApiOperation({ summary: 'Stop generating vehicle logs.' })
  @ApiResponse({ status: 200, description: 'Any potentially ongoing vehicle logs generation has been stopped' })
  stopGeneratingLogs(): void {
    this.vehicleLogsUtilsService.stopGeneratingLogs();
  }
}
