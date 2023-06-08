import { PaypalService } from './../services/paypal.service';
import { BaseMicroserviceResponse } from './../../../../../shared/dtos/base-microservice-response.dto';
import { UserInput } from '../dtos/user-input.dto';
import { UserService } from '../services/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Permissions } from '../../../../../shared/decorators/permission.decorator';
import { PermissionGuard } from '../../../../../shared/guards/permission.guard';
import { RequestContext } from '../../../../../shared/dtos/request-context.dto';
import { ReqContext } from '../../../../../shared/request-context/request-context.decorator';
import { USER_ROLE } from '../../../../../shared/constants/common';
import { UserPaymentInputDto } from '../dtos/user-payment-input.dto';
import { UserLoginInfo } from '../dtos/user-login-info.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ExecutePaymentInput } from '../dtos/execute-payment-input.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private paypalService: PaypalService,
  ) {}

  @Post('/execute-payment')
  async executePayment(@Body() executePaymentInput: ExecutePaymentInput) {
    const access_token = await this.paypalService.executePaymentToken(
      executePaymentInput,
    );
    return { data: access_token };
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  @Permissions(USER_ROLE.READ_USER, USER_ROLE.ALL_USER)
  @UseGuards(PermissionGuard)
  async getUser(@ReqContext() ctx: RequestContext, @Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post('/token')
  async getToken(
    @Body() userLoginInfo: UserLoginInfo,
  ): Promise<BaseMicroserviceResponse<UserLoginOutput>> {
    const userToken = await this.userService.getToken(userLoginInfo);
    return { data: userToken };
  }

  @Get('/:id/token')
  async getUserToken(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Query('detail', ParseBoolPipe) detail: boolean,
  ): Promise<any> {
    return await this.userService.getUserToken(id, detail);
  }

  @Get('/reset-password/:userId')
  async resetPassword(@Param('userId') userId: string) {
    const ticketUrl = await this.userService.resetPassword(userId);
    return { data: ticketUrl };
  }

  @Post()
  @Permissions(USER_ROLE.CREATE_USER, USER_ROLE.ALL_USER)
  @UseGuards(PermissionGuard)
  async createUser(
    @ReqContext() ctx: RequestContext,
    @Body() userInput: UserInput,
  ) {
    const newUser = await this.userService.createUser(userInput);
    return { data: newUser };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() userInput: UserInput) {
    return this.userService.updateUser(id, userInput);
  }

  @Post('/payment-url')
  async getPaymentUrl(@Body() paymentInput: UserPaymentInputDto) {
    return this.userService.getPaymentUrl(paymentInput);
  }

  @Post('/:id/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return { imageUrl: await this.userService.uploadFile(file, id) };
  }
}
