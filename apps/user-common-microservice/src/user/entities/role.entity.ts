import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserAuthority } from './user-authority.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryColumn({
    name: 'role_id',
    type: 'char',
    length: 26,
  })
  roleId: string;

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 100,
  })
  roleName: string;

  @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.role, {
    cascade: true,
  })
  userAuthorities: UserAuthority[];
}
