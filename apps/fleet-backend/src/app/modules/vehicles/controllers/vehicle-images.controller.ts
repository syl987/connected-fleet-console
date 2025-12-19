import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageDto } from '../../../common/dto/image.dto';
import { Response } from 'express';
import type { File as MulterFile } from 'multer';
import { ImageEntity } from '../../../common/entities/image.entity';
import { VehicleImagesService } from '../services/vehicle-images.service';

@ApiTags('Vehicle Images')
@Controller('vehicles')
export class VehicleImagesController {
  constructor(private readonly imagesService: VehicleImagesService) {}

  @Post(':id/images')
  @ApiOperation({ summary: 'Upload an image for a vehicle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: MulterFile,
  ) {
    const img = await this.imagesService.create(id, file);
    return this.toImageDto(img);
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'List images for a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle images', type: [ImageDto] })
  async listImages(@Param('id', ParseIntPipe) id: number) {
    const list = await this.imagesService.findAllByVehicle(id);
    return list.map((i) => this.toImageDto(i));
  }

  @Get('images/:id')
  @ApiOperation({ summary: 'Serve image by id (from DB)' })
  async serveImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const img = await this.imagesService.findOne(id);
    if (!img.data) throw new Error('Image data not found');
    res.setHeader('Content-Type', img.mimeType);
    return res.send(img.data);
  }

  @Delete(':id/images/:imageId')
  @ApiOperation({ summary: 'Delete an image for a vehicle' })
  async deleteImage(@Param('id', ParseIntPipe) id: number, @Param('imageId', ParseIntPipe) imageId: number) {
    await this.imagesService.remove(id, imageId);
  }

  private toImageDto(i: ImageEntity): ImageDto {
    return {
      id: i.id,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      deletedAt: i.deletedAt?.toISOString?.(),
      version: i.version,
      filename: i.filename,
      url: `/vehicles/images/${i.id}`,
      thumbnailUrl: i.thumbnailUrl,
      mimeType: i.mimeType,
      size: i.size,
    };
  }
}
