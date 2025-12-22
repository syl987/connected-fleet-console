import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleLogsStreamController } from './controllers/vehicle-logs-stream.controller';
import { VehicleLogsUtilsController } from './controllers/vehicle-logs-utils.controller';
import { VehicleLogsController } from './controllers/vehicle-logs.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehicleLog } from './entities/vehicle-log.entity';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLogsDataLoader } from './loader/vehicle-logs-data.loader';
import { VehiclesDataLoader } from './loader/vehicles-data.loader';
import { VehicleLogsAnalyticsService } from './services/vehicle-logs-analytics.service';
import { VehicleLogsUtilsService } from './services/vehicle-logs-utils.service';
import { VehicleLogsService } from './services/vehicle-logs.service';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleLog])],
  providers: [
    VehiclesService,
    VehicleLogsService,
    VehicleLogsUtilsService,
    VehicleLogsAnalyticsService,
    VehiclesDataLoader,
    VehicleLogsDataLoader,
  ],
  controllers: [
    VehiclesController,
    VehicleLogsController,
    VehicleLogsStreamController,
    VehicleLogsUtilsController,
  ],
  exports: [
    VehiclesService,
    VehicleLogsService,
    VehicleLogsUtilsService,
    VehicleLogsAnalyticsService,
  ],
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
