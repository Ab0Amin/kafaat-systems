import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class MobileDeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  deviceId!: string;

  @Column()
  deviceType!: 'android' | 'ios';

  @Column()
  registeredAt!: Date;

  @OneToOne(() => UserEntity, user => user.device)
  @JoinColumn()
  user!: UserEntity;
}
