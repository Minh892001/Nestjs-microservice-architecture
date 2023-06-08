import {
  EXPIRED_TIME,
  PAYPAL_METHOD,
} from './../../../../../shared/constants/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { Connection } from 'typeorm';
import { ulid } from 'ulid';
import { UserDetail } from '../../../../../shared/dtos/user-detail.dto';
import { Auth0UserInput } from '../dtos/auth0-user-input.dto';
import { RoleOutput } from '../dtos/role-output.dto';
import { UserInput } from '../dtos/user-input.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { UserAuthority } from '../entities/user-authority.entity';
import { User } from '../entities/user.entity';
import { RoleRepository } from '../repositories/role.repository';
import { UserAuthorityRepository } from '../repositories/user-authority.repository';
import { UserRepository } from '../repositories/user.repository';
import { Auth0Service } from './auth0.service';
import { PaypalService } from './paypal.service';
import { PaymentInputDto } from '../dtos/payment-input.dto';
import { PaymentRedirectUrlDto } from '../dtos/payment-redirect-url.dto';
import { PaymentMethodDto } from '../dtos/payment-method.dto';
import {
  AmountDetailDto,
  AmountInputDto,
  PaymentTransactionInputDto,
} from '../dtos/payment-transaction-input.dto';
import { UserPaymentInputDto } from '../dtos/user-payment-input.dto';
import { ConfigService } from '@nestjs/config';
import { UserLoginInfo } from '../dtos/user-login-info.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';
import { S3Service } from '../../s3/services/s3.service';

const AUTH0 = 'auth0|';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userAuthorityRepository: UserAuthorityRepository,
    private readonly configService: ConfigService,
    private connection: Connection,
    private auth0Service: Auth0Service,
    private paypalService: PaypalService,
    private s3Service: S3Service,
  ) {}

  async getUsers(): Promise<UserOutput[]> {
    const users: User[] = await this.userRepository.find();
    return plainToInstance(UserOutput, users);
  }

  async getUser(userId: string): Promise<UserOutput> {
    const user: User = await this.userRepository.findOneBy({ userId: userId });
    return plainToInstance(UserOutput, user);
  }

  async createUser(userInput: UserInput): Promise<UserOutput> {
    const emailExist = await this.userRepository.findOne({
      where: {
        email: userInput.email,
      },
      withDeleted: true,
    });
    if (emailExist) {
      throw new BadRequestException('Email is existed');
    }
    const generateUserPassword = this.generateAuth0Password();
    const newUserId = ulid();
    const newUser = plainToInstance(User, {
      userId: newUserId,
      auth0userId: `${AUTH0}${newUserId}`,
      password: generateUserPassword,
      ...userInput,
    });
    const foundRoles = await this.roleRepository.getRoleIds(userInput.roles);
    const roleIds = foundRoles.map((role) => role.roleId);
    const userAuthorities: UserAuthority[] = [];
    roleIds.forEach((roleId) => {
      userAuthorities.push(
        plainToInstance(UserAuthority, {
          userId: newUserId,
          roleId: roleId,
        }),
      );
    });
    const auth0UserInput = new Auth0UserInput();
    auth0UserInput.userId = newUserId;
    auth0UserInput.email = userInput.email;
    auth0UserInput.blocked = false;
    auth0UserInput.verifyEmail = false;
    auth0UserInput.password = generateUserPassword;
    auth0UserInput.givenName = userInput.firstName;
    auth0UserInput.familyName = userInput.lastName;
    auth0UserInput.name = `${userInput.firstName} ${userInput.lastName}`;
    const token = await this.auth0Service.getToken();
    await this.connection.transaction(async (trans) => {
      await trans.save(newUser);
      await trans.save(userAuthorities);
      await this.auth0Service.createAuth0User(auth0UserInput, token);
    });
    const newUserOutput = await this.userRepository.findOneBy({
      userId: newUser.userId,
    });
    return plainToInstance(
      UserOutput,
      { ...newUserOutput, roles: plainToInstance(RoleOutput, foundRoles) },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteUser(userId: string): Promise<void> {
    const user: User = await this.userRepository.findOneBy({ userId: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.softDelete({ userId: userId });
  }

  async updateUser(userId: string, userInput: UserInput): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ userId: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userInput.email) {
      const emailExist = await this.userRepository.findOneBy({
        email: userInput.email,
      });
      if (emailExist && emailExist.userId !== userId) {
        throw new BadRequestException('Email is existed');
      }
    }
    const newUser = plainToInstance(User, { userId, ...userInput });
    await this.connection.transaction(async (trans) => {
      await trans.save(newUser);
    });
    return await this.userRepository.findOneBy({ userId });
  }

  async getUserToken(userId: string, detail: boolean) {
    const user = await this.userRepository.findOneBy({ userId });
    const userRoles = (
      await this.userAuthorityRepository.getUserRolesById(userId)
    ).map((role) =>
      plainToInstance(RoleOutput, role.role, {
        excludeExtraneousValues: true,
      }),
    );
    const userDetail = plainToInstance(UserDetail, {
      ...user,
      roles: userRoles,
      exp: moment().unix() + EXPIRED_TIME,
    });
    const token = Buffer.from(JSON.stringify(userDetail)).toString('base64');
    if (detail) {
      return {
        token: token,
        detail: userDetail,
      };
    }
    return { token: token };
  }

  async getToken(userLoginInfo: UserLoginInfo): Promise<UserLoginOutput> {
    return this.auth0Service.getUserToken(
      userLoginInfo.username,
      userLoginInfo.password,
    );
  }

  async resetPassword(userId: string) {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const token = await this.auth0Service.getToken();
    const ticketUrl = await this.auth0Service.getChangePasswordTicket(
      `${AUTH0}${userId}`,
      token,
    );
    return ticketUrl;
  }

  async getPaymentUrl(paymentInput: UserPaymentInputDto) {
    const newInput = new PaymentInputDto();
    newInput.payer = plainToInstance(PaymentMethodDto, {
      payment_method: PAYPAL_METHOD.PAYPAL,
    });
    newInput.redirect_urls = plainToInstance(PaymentRedirectUrlDto, {
      return_url: this.configService.get<string>('paypal.returnUrl'),
      cancel_url: this.configService.get<string>('paypal.cancelUrl'),
    });

    newInput.transactions = [
      plainToInstance(PaymentTransactionInputDto, {
        amount: plainToInstance(AmountInputDto, {
          total: paymentInput.total,
          currency: 'USD',
          details: plainToInstance(AmountDetailDto, paymentInput.details, {
            excludeExtraneousValues: true,
          }),
        }),
      }),
    ];

    return this.paypalService.getPaymentUrl(newInput);
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    const key = `${file.fieldname}${Date.now()}`;
    const imageUrl = await this.s3Service.uploadFile(file, key);

    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.photoUrl = imageUrl.url;
    await this.userRepository.save(user);
    return imageUrl;
  }

  generateAuth0Password(): string {
    return (
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).toUpperCase().slice(2)
    );
  }
}
