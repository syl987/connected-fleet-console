import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

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
}
