import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleLogsController } from './controllers/vehicle-logs.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehicleLog } from './entities/vehicle-log.entity';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLogsDataLoader } from './loader/vehicle-logs-data.loader';
import { VehiclesDataLoader } from './loader/vehicles-data.loader';
import { VehicleLogsService } from './services/vehicle-logs.service';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleLog])],
  providers: [
    VehiclesService,
    VehicleLogsService,
    VehiclesDataLoader,
    VehicleLogsDataLoader,
  ],
  controllers: [VehiclesController, VehicleLogsController],
  exports: [VehiclesService, VehicleLogsService],
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
