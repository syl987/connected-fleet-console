import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VehicleLog } from './vehicle-log.entity';

export enum FuelType {
  GAS = 'GAS',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

@Entity()
export class Vehicle extends BaseEntity {
  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column({ unique: true })
  vin!: string;

  @Column({ default: 0 })
  mileage!: number;

  @Column({ nullable: true })
  color?: string;

  // Use simple-enum for SQLite compatibility
  @Column({ type: 'simple-enum', enum: FuelType, default: FuelType.GAS })
  fuelType!: FuelType;

  @OneToMany(() => VehicleLog, (log) => log.vehicle)
  logs!: VehicleLog[];
}
