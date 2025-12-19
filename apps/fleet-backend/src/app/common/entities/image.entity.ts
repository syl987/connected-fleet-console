import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class ImageEntity extends AbstractEntity {
  @Column()
  filename!: string;

  // Binary image data stored in DB
  @Column({ type: 'blob', nullable: true })
  data?: Buffer;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;
}
