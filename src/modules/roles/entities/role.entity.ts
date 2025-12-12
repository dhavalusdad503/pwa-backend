import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  // ---------- Timestamp ----------
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ---------- Relations ----------
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
