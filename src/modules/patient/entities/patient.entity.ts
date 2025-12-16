import { Organization } from '@modules/organization/entities/organization.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'org_id' })
  orgId: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', name: 'primary_address', nullable: true })
  primaryAddress: string | null;

  // ---------- Timestamps ----------
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ---------- Relations ----------
  @ManyToOne(() => Organization, (organization) => organization.patients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'org_id' })
  organization: Organization;
}
