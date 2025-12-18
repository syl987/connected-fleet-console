import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './modules/vehicles/entities/vehicle.entity';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Vehicle],
    }),
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
