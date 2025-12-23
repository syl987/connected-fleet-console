import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateVehicleLogsDto } from '../dto/generate-vehicle-logs.dto';
import { VehicleLogDto } from '../dto/vehicle-log.dto';
import { toVehicleLogDto } from '../mappers/vehicle-log.mapper';
import { VehicleLogsUtilsService } from '../services/vehicle-logs-utils.service';

@ApiTags('Logs Utilities')
@Controller('logs/utils/vehicles')
export class VehicleLogsUtilsController {
  constructor(private readonly vehicleLogsUtilsService: VehicleLogsUtilsService) {}

  @Post('parse-and-save')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Parse and save vehicle logs from a text file.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 201, description: 'File uploaded and parsed successfully', type: [VehicleLogDto] })
  async parseAndSave(
    @UploadedFile() file: { originalname: string; filename: string; mimetype: string; size: number; buffer: Buffer },
  ): Promise<VehicleLogDto[]> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const mimetype = file.mimetype;
    if (!mimetype || (!mimetype.startsWith('text/') && mimetype !== 'text/plain')) {
      throw new BadRequestException('Invalid file type. Only text files are allowed.');
    }
    return (await this.vehicleLogsUtilsService.parseAndSave(file)).map(toVehicleLogDto);
  }

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
