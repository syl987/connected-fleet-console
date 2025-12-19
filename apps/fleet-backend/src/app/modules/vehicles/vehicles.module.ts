import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './controllers/vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImagesService } from './services/vehicle-images.service';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehiclesService, VehicleImagesService],
  controllers: [VehiclesController],
  exports: [VehiclesService, VehicleImagesService],
})
export class VehiclesModule {}
