import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'reset_tokens' })
export class ResetTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  used!: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'adminId' })
  admin!: UserEntity;

  @Column()
  adminId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
