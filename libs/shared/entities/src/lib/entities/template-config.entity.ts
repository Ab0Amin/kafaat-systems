import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'template_configs', schema: 'owner' })
export class TemplateConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tableName!: string;

  @Column()
  schemaName!: string;

  @Column({ default: true })
  copyStructure!: boolean;

  @Column({ default: true })
  copyData!: boolean;

  @Column({ default: 0 })
  priority!: number;

  @Column({ type: 'jsonb', nullable: true })
  options!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}