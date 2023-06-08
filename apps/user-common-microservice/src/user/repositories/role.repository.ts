import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getRoleIds(roleNames: string[]): Promise<Role[]> {
    const queryBuilder = this.createQueryBuilder('roles').where(
      'roles.roleName IN (:roleNames)',
      { roleNames: roleNames },
    );
    return await queryBuilder.getMany();
  }
}
