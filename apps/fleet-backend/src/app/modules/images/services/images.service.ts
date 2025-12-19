import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from '../entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private readonly repository: Repository<ImageEntity>) {}

  async create(file: any): Promise<ImageEntity> {
    const img = this.repository.create({
      filename: file.originalname,
      data: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
    } as Partial<ImageEntity>);
    return this.repository.save(img);
  }

  async findAll(page = 1, size = 10): Promise<{ items: ImageEntity[]; total: number }> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' as any },
    });
    return { items, total };
  }

  async findOne(id: number): Promise<ImageEntity> {
    const img = await this.repository.findOne({ where: { id } });
    if (!img) throw new NotFoundException(`Image ${id} not found`);
    return img;
  }

  async update(id: number, dto: Partial<Pick<ImageEntity, 'filename'>>): Promise<ImageEntity> {
    const img = await this.findOne(id);
    if (dto.filename) img.filename = dto.filename;
    return this.repository.save(img);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repository.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Image ${id} not found`);
  }
}
