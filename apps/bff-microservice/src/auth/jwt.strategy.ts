import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { STRATEGY_JWT_AUTH } from './constant';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_AUTH) {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>(
          'auth0.baseUrl',
        )}/.well-known/jwks.json`,
      }),
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `${configService.get<string>('auth0.baseUrl')}/`,
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(req: any, payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Missing token');
    }
    let userId = payload.sub;
    if (userId.split('|').length > 1) {
      userId = userId.split('|')[1];
    }
    return this.authService.getUserAccessInfo(userId, true);
  }
}
