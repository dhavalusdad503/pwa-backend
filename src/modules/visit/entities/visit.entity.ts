import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Patient } from 'src/modules/patient/entities/patient.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
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

  @Column({ type: 'timestamp', name: 'submitted_at', nullable: true })
  submittedAt: Date;

  @Column({ type: 'varchar', name: 'service_type', length: 100 })
  serviceType: string;

  @Column({ type: 'text' })
  notes: string;

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

  @Column({ type: 'boolean', name: 'client_present' })
  clientPresent: boolean;

  @Column({ type: 'boolean', name: 'follow_up' })
  followUp: boolean;

  @Column({ type: 'boolean', name: 'medication_reviewed' })
  medicationReviewed: boolean;

  @Column({ type: 'boolean', name: 'safety_check' })
  safetyCheck: boolean;
}
