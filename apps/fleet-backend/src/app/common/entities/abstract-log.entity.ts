import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export abstract class AbstractLog extends AbstractEntity {
  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: string;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
