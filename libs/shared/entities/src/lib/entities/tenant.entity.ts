import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants', schema: 'owner' })
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  domain!: string;

  @Column({ unique: true })
  schema_name!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  plan!: string;

  @Column({ nullable: true })
  maxUsers!: number;

  @Column({ type: 'jsonb', nullable: true })
  settings!: Record<string, any>;

  @Column({ nullable: true })
  contactEmail!: string;

  @Column({ nullable: true })
  contactPhone!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
