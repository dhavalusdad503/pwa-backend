import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrgUser } from '../../org-user/entities/org-user.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  // ----------- Timestamps (Sequelize timestamps: true) -----------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ----------- Relations -----------

  // One Organization -> Many OrgUser records
  @OneToMany(() => OrgUser, (orgUser) => orgUser.organization)
  orgUsers: OrgUser[];

  // Many-to-Many with users via org_users pivot table
  @ManyToMany(() => User, (user) => user.organizations)
  @JoinTable({
    name: 'org_users',
    joinColumn: { name: 'org_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
