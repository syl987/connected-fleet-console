import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from './modules/images/images.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      autoLoadEntities: true,
    }),
    VehiclesModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
