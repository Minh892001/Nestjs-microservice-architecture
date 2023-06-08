import { plainToInstance } from 'class-transformer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RoleInput } from '../dtos/role-input.dto';
import { Role } from '../entities/role.entity';
import { ulid } from 'ulid';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private connection: Connection,
  ) {}

  async createRole(roleInput: RoleInput): Promise<Role> {
    const existRole = await this.roleRepository.findOneBy({
      roleName: roleInput.roleName,
    });
    if (existRole) {
      throw new BadRequestException('Role is existed');
    }
    const newRole = plainToInstance(Role, {
      roleId: ulid(),
      ...roleInput,
    });
    await this.connection.transaction(async (trans) => {
      await trans.save(newRole);
    });
    return await this.roleRepository.findOneBy({ roleId: newRole.roleId });
  }

  async getRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
