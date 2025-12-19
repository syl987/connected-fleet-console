import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class LogEntity extends AbstractEntity {
  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: string;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
