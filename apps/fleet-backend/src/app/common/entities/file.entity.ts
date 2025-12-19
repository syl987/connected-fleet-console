import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class FileEntity extends AbstractEntity {
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
