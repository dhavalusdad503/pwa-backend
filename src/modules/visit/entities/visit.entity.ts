import { Organization } from '@modules/organization/entities/organization.entity';
import { Patient } from '@modules/patient/entities/patient.entity';
import { User } from '@modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'visits' })
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ------------------------------
  // ORG RELATION
  // ------------------------------
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @Column('uuid', { name: 'org_id' })
  orgId: string;

  // ------------------------------
  // CAREGIVER RELATION
  // ------------------------------
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caregiver_id' })
  caregiver: User;

  @Column('uuid', { name: 'caregiver_id' })
  caregiverId: string;

  // ------------------------------
  // PATIENT RELATION
  // ------------------------------
  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('uuid', { name: 'patient_id' })
  patientId: string;

  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', name: 'ended_at' })
  endedAt: Date;

  @Column({ type: 'timestamp', name: 'submitted_at' })
  submittedAt: Date;

  @Column({ type: 'varchar', name: 'service_type', length: 100 })
  serviceType: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text' })
  address: string;

  @Column({
    type: 'decimal',
    name: 'latitude',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude: number;

  @Column({
    type: 'decimal',
    name: 'longitude',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  longitude: number;

  @Column({ type: 'boolean' })
  attestation: boolean;

  @Column({ type: 'varchar', name: 'attestation_name' })
  attestationName: string;

  @Column({
    type: 'boolean',
    name: 'client_present',
    nullable: true,
    default: false,
  })
  clientPresent: boolean;

  @Column({
    type: 'boolean',
    name: 'follow_up',
    nullable: true,
    default: false,
  })
  followUp: boolean;

  @Column({
    type: 'boolean',
    name: 'medication_reviewed',
    nullable: true,
    default: false,
  })
  medicationReviewed: boolean;

  @Column({
    type: 'boolean',
    name: 'safety_check',
    nullable: true,
    default: false,
  })
  safetyCheck: boolean;

  // ------------------------------
  // AUDIT COLUMNS
  // ------------------------------
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Not persisted
  tempId?: number;
}
