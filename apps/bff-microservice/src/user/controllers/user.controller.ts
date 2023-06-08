import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RequestContext } from '../../../../../shared/dtos/request-context.dto';
import { ReqContext } from '../../../../../shared/request-context/request-context.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserInputDto } from '../dtos/user-input.dto';
import { UserLoginInfo } from '../dtos/user-login-info.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@ReqContext() ctx: RequestContext, @Param('id') id: string) {
    const user = await this.userService.getUser(ctx, id);
    return {
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(
    @ReqContext() ctx: RequestContext,
    @Body() userInput: UserInputDto,
  ) {
    const newUser = await this.userService.createUser(ctx, userInput);
    return newUser;
  }

  @Post('/login')
  async login(@Body() userLoginInfo: UserLoginInfo): Promise<UserLoginOutput> {
    return this.userService.login(userLoginInfo);
  }

  @Post('/confirm-payment')
  async confirmPayment(@Body() paymentInput) {
    return this.userService.confirmPayment(paymentInput);
  }
}
