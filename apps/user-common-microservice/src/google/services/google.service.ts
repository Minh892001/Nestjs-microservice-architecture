import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UserGoogleOutput } from '../dtos/User.dto';
import { User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repositories/user.repository';
import { Connection } from 'typeorm';
import { ulid } from 'ulid';
import { plainToInstance } from 'class-transformer';
import { UserOutput } from '../../user/dtos/user-output.dto';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userRepository: UserRepository,
    private connection: Connection,
  ) {
    this.googleOAuth2Client = new OAuth2Client({
      clientId:
        '940059582838-0b5g069d4oucqsnqng90pkif8jfkgj7b.apps.googleusercontent.com',
      clientSecret: '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',
      redirectUri: 'http://localhost:3001/login-google',
    });
  }
  googleLogin(req) {
    const user = req.user;
    const newUser = plainToInstance(User, {
      userId: ulid(),
      email: user.email,
      password: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.picture,
      auth0userId: user.email,
      phone: user.phoneNumber,
    });

    this.addUser(newUser);
    const token = user.accessToken;
    const userdb = newUser;
    return { userdb, token };
  }

  async addUser(user: User) {
    const userdb = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userdb) throw new BadRequestException('User is exits');
    const newUser = plainToInstance(User, user);
    const userOutput = await this.userRepository.save(newUser);

    return plainToInstance(UserOutput, userOutput);
  }

  logout(token: string) {
    this.revokeAccessToken(token);
  }
  private readonly googleOAuth2Client: OAuth2Client;

  async revokeAccessToken(accessToken: string): Promise<void> {
    await this.googleOAuth2Client.revokeToken(accessToken);
  }
}
