import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './controllers/images.controller';
import { ImageEntity } from './entities/image.entity';
import { ImagesService } from './services/images.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImagesService],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
