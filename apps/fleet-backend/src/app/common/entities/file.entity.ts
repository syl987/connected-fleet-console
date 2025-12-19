import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class FileEntity extends BaseEntity {
  @Column()
  filename!: string;

  // Binary image data stored in DB
  @Column({ type: 'blob', nullable: true })
  data?: Buffer;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;
}
