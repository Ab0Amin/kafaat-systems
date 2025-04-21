import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @CreateDateColumn()
  created_at!: Date;
}
