import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { LogsController } from './controllers/logs.controller';
import { VehicleLog } from './entities/vehicle-log.entity';
import { LogsService } from './services/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleLog, Vehicle])],
  providers: [LogsService],
  controllers: [LogsController],
  exports: [LogsService],
})
export class LogsModule {}
