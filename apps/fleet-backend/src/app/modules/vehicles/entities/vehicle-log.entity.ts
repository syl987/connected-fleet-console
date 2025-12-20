import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LogEntity } from '../../../common/entities/log.entity';
import { Vehicle } from './vehicle.entity';

@Entity({ orderBy: { timestamp: 'DESC' } })
export class VehicleLog extends LogEntity {
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.logs, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  vehicle?: Vehicle;
}
