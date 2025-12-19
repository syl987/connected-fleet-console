import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './controllers/vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesDataLoader } from './services/vehicles-data.loader';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehiclesService, VehiclesDataLoader],
  controllers: [VehiclesController],
  exports: [VehiclesService],
})
export class VehiclesModule implements OnModuleInit {
  constructor(private readonly dataLoader: VehiclesDataLoader) {}

  async onModuleInit(): Promise<void> {
    await this.dataLoader.loadInitialData();
  }
}
