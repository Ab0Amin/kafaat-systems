import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class MobileDeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  deviceId!: string;

  @Column({ nullable: true })
  platform!: string;

  @Column({ nullable: true })
  model!: string;
  @Column({ nullable: true })
  version!: string;

  @Column()
  registeredAt!: Date;

  @OneToOne(() => UserEntity, user => user.device)
  @JoinColumn()
  user!: UserEntity;
}
