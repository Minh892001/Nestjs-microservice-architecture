import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'user_authorities' })
export class UserAuthority {
  @PrimaryColumn({
    type: 'char',
    length: 26,
    name: 'user_id',
  })
  userId: string;

  @PrimaryColumn({
    type: 'char',
    length: 26,
    name: 'role_id',
  })
  roleId: string;

  @ManyToOne(() => User, (user) => user.userAuthorities, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'userId',
  })
  user: User;

  @ManyToOne(() => Role, (user) => user.userAuthorities, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'roleId',
  })
  role: Role;
}
