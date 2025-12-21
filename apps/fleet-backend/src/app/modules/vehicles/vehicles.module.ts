import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleLogsUtilsController } from './controllers/vehicle-logs-utils.controller';
import { VehicleLogsController } from './controllers/vehicle-logs.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehicleLog } from './entities/vehicle-log.entity';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLogsDataLoader } from './loader/vehicle-logs-data.loader';
import { VehiclesDataLoader } from './loader/vehicles-data.loader';
import { VehicleLogsUtilsService } from './services/vehicle-logs-utils.service';
import { VehicleLogsService } from './services/vehicle-logs.service';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleLog])],
  providers: [
    VehiclesService,
    VehicleLogsService,
    VehicleLogsUtilsService,
    VehiclesDataLoader,
    VehicleLogsDataLoader,
  ],
  controllers: [VehiclesController, VehicleLogsController, VehicleLogsUtilsController],
  exports: [VehiclesService, VehicleLogsService, VehicleLogsUtilsService],
})
export class VehiclesModule implements OnModuleInit {
  constructor(
    private readonly vehiclesDataLoader: VehiclesDataLoader,
    private readonly vehicleLogsDataLoader: VehicleLogsDataLoader,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.vehiclesDataLoader.loadInitialData();
    await this.vehicleLogsDataLoader.loadInitialData();
  }
}
