import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleInput } from '../dtos/role-input.dto';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async createRole(@Body() roleInput: RoleInput): Promise<Role> {
    return await this.roleService.createRole(roleInput);
  }

  @Get()
  async getRole(): Promise<Role[]> {
    return this.roleService.getRoles();
  }
}
