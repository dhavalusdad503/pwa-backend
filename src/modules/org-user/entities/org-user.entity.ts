import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'org_users' })
export class OrgUser {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('uuid', { name: 'org_id' })
  orgId: string;

  // ----- RELATIONS -----
  @ManyToOne(() => User, (user) => user.userOrgs, { onDelete: 'CASCADE' }) // Update this to match the property name `userOrgs`
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.orgUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'org_id' })
  organization: Organization;
}
