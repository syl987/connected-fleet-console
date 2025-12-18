import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'datetime' })
  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'datetime' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  @VersionColumn()
  version!: number;
}
