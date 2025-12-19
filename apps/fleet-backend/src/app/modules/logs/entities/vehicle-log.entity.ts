import { Entity, ManyToOne } from 'typeorm';
import { LogEntity } from '../../../common/entities/log.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class VehicleLog extends LogEntity {
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.logs, { nullable: false, onDelete: 'CASCADE' })
  vehicle!: Vehicle;
}
