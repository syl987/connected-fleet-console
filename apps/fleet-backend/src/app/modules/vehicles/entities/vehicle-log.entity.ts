import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LogEntity } from '../../../common/entities/log.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class VehicleLog extends LogEntity {
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.logs, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  vehicle!: Vehicle;
}
