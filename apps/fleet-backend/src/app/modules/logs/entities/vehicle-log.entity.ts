import { Column, Entity } from 'typeorm';
import { LogEntity } from '../../../common/entities/log.entity';

@Entity()
export class VehicleLog extends LogEntity {
  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: string;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
