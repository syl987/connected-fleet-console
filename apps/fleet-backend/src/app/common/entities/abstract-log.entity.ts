import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class AbstractLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'datetime' })
  timestamp!: Date;

  @Column()
  severity!: string;

  @Column()
  code!: number;

  @Column('text')
  message!: string;
}
