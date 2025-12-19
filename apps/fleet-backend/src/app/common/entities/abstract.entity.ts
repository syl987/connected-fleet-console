import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

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

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @Column()
  @VersionColumn()
  version!: number;
}
