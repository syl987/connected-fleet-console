import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class LogEntity extends BaseEntity {
  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: string;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
