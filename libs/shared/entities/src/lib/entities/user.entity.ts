import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { RoleType } from './role.entity';
import { MobileDeviceEntity } from './device.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  passwordHash!: string;

  @Column({ default: false })
  isActive!: boolean;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.ADMIN,
  })
  role!: RoleType;

  @Column({ nullable: true })
  schemaName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => MobileDeviceEntity, device => device.user, { nullable: true })
  device!: MobileDeviceEntity;
}
