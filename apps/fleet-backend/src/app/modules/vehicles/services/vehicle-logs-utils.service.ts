import { Injectable } from '@nestjs/common';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { VehicleLogsService } from './vehicle-logs.service';

@Injectable()
export class VehicleLogsUtilsService {
  constructor(private readonly vehicleLogsService: VehicleLogsService) {}

  async generateStart(createDto: CreateVehicleLogDto): Promise<void> {}
}
