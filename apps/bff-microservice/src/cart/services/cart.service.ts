import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestContext } from '../../../../../shared/dtos/request-context.dto';
import { CartInput } from '../dtos/cart-input.dto';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from '../../../../../shared/http-requests/http-request.service';
import { PERMISSION_TOKEN_KEY } from '../../../../../shared/constants/common';
import { CartOutput } from '../dtos/cart-ouput.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';

const pathCarts = '/carts';
const pathUsers = '/users';

@Injectable()
export class CartService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpRequestService,
  ) {}

  async createCart(ctx: RequestContext, cartInput: CartInput) {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
    const apiUserUrl = `${userMicroserviceUrl}${pathUsers}/${ctx.user.detail.userId}`;
    const user = await this.httpService.get<UserOutput>(apiUserUrl, {
      headers: {
        [PERMISSION_TOKEN_KEY]: ctx.user.token,
      },
    });

    if (user.error) {
      throw new BadRequestException('User not found');
    }

    const productMicroserviceUrl = this.configService.get<string>(
      'microservice.productCommon',
    );
    const apiUrl = `${productMicroserviceUrl}${pathCarts}`;
    const response = await this.httpService.post<CartOutput>(
      apiUrl,
      cartInput,
      {
        params: {
          userId: user.userId,
        },
        headers: {
          [PERMISSION_TOKEN_KEY]: ctx.user.token,
        },
      },
    );
    return response;
  }
}
