import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserAuthority } from '../entities/user-authority.entity';

@Injectable()
export class UserAuthorityRepository extends Repository<UserAuthority> {
  constructor(private dataSource: DataSource) {
    super(UserAuthority, dataSource.createEntityManager());
  }

  async getUserRolesById(userId: string): Promise<UserAuthority[]> {
    const queryBuilder = this.createQueryBuilder('userAuthorities')
      .leftJoinAndSelect('userAuthorities.role', 'role')
      .where('userAuthorities.userId = :userId', { userId });
    return queryBuilder.getMany();
  }
}
