import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum LogSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

@Entity()
export class LogEntity extends BaseEntity {
  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: LogSeverity;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
