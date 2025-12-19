import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './modules/images/entities/image.entity';
import { ImagesModule } from './modules/images/images.module';
import { Vehicle } from './modules/vehicles/entities/vehicle.entity';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Vehicle, Image],
    }),
    VehiclesModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
