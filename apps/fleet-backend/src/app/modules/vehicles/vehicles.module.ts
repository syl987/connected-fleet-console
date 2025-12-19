import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleLogsController } from './controllers/vehicle-logs.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehicleLog } from './entities/vehicle-log.entity';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleLogsService } from './services/vehicle-logs.service';
import { VehiclesDataLoader } from './services/vehicles-data.loader';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleLog])],
  providers: [VehiclesService, VehicleLogsService, VehiclesDataLoader],
  controllers: [VehiclesController, VehicleLogsController],
  exports: [VehiclesService, VehicleLogsService],
})
export class VehiclesModule implements OnModuleInit {
  constructor(private readonly dataLoader: VehiclesDataLoader) {}

  async onModuleInit(): Promise<void> {
    await this.dataLoader.loadInitialData();
  }
}
