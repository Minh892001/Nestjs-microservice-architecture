import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReqContext } from '../../../../../shared/request-context/request-context.decorator';
import { RequestContext } from '../../../../../shared/dtos/request-context.dto';
import { CartInput } from '../dtos/cart-input.dto';
import { CartService } from '../services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCart(
    @ReqContext() ctx: RequestContext,
    @Body() cartInput: CartInput,
  ) {
    const newCart = await this.cartService.createCart(ctx, cartInput);
    return newCart;
  }
}
