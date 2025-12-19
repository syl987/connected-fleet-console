import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { ImageEntity } from '../../../common/entities/image.entity';

export enum FuelType {
  GAS = 'GAS',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

@Entity()
export class Vehicle extends AbstractEntity {
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

  @Column({ type: 'enum', enum: FuelType, default: FuelType.GAS })
  fuelType!: FuelType;

  @OneToOne(() => ImageEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  image?: ImageEntity;
}
