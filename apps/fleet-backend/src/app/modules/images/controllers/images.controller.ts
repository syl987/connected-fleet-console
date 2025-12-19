import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import type { File as MulterFile } from 'multer';
import { memoryStorage } from 'multer';
import { ImageDto } from '../dto/image.dto';
import { ImageEntity } from '../entities/image.entity';
import { ImagesService } from '../services/images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file: MulterFile) {
    const img = await this.service.create(file);
    return this.toDto(img);
  }

  @Get()
  @ApiOperation({ summary: 'List images' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const { items, total } = await this.service.findAll(page, size);
    return { data: items.map((i) => this.toDto(i)), total, page, size };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image metadata' })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const img = await this.service.findOne(id);
    return this.toDto(img);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get image bytes' })
  async getContent(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const img = await this.service.findOne(id);
    res.setHeader('Content-Type', img.mimeType);
    return res.send(img.data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image metadata' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: { filename?: string }) {
    const updated = await this.service.update(id, body);
    return this.toDto(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  private toDto(i: ImageEntity): ImageDto {
    return {
      id: i.id,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      deletedAt: i.deletedAt?.toISOString?.(),
      version: i.version,
      filename: i.filename,
      mimeType: i.mimeType,
      size: i.size,
      url: `/images/${i.id}/content`,
      thumbnailUrl: i.thumbnailUrl,
    };
  }
}
