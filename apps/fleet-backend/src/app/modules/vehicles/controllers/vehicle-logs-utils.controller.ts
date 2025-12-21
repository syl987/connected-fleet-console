import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleLogDto } from '../dto/vehicle-log.dto';
import { VehicleLogsService } from '../services/vehicle-logs.service';

@ApiTags('Logs')
@Controller('logs/utils/vehicles')
export class VehicleLogsUtilsController {
  constructor(private readonly vehicleLogsService: VehicleLogsService) {}

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
      throw new Error('No file uploaded');
    }
    throw new Error('Method not implemented.');
  }
}
