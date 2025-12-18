import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './controllers/vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './services/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService],
})
export class VehiclesModule {}
