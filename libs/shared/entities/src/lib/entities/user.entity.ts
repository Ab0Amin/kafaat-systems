import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;
  @Column({ nullable: false, default: 'new' })
  lastName23!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  passwordHash!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  tenantId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
