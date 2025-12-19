import { Column, Entity } from 'typeorm';
import { FileEntity } from '../../../common/entities/file.entity';

@Entity()
export class ImageEntity extends FileEntity {
  @Column({ nullable: true })
  thumbnailUrl?: string;
}
