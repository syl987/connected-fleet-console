import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

@Entity()
export class Image extends AbstractEntity {
  @Column()
  filename!: string;

  @Column({ type: 'blob', nullable: true })
  data?: Buffer;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;
}
