import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CartIntput } from '../dtos/cart-input.dto';
import { CartOutput } from '../dtos/cart-ouput.dto';
import { CartService } from '../services/cart.service';
import { PermissionGuard } from '../../../../../shared/guards/permission.guard';
import { USER_ROLE } from '../../../../../shared/constants/common';

@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post()
  async createCart(
    @Body() cartInput: CartIntput,
    @Query('userId') userId: string,
  ): Promise<CartOutput> {
    return await this.cartService.createCart(userId, cartInput);
  }

  @Patch()
  async updateStatusPaid(@Query('cartId') cartId: string) {
    return await this.cartService.updateStatusPaid(cartId);
  }

  @Get()
  async getCarts(
    @Query('userId') userId: string,
    @Query('cartId') cartId: string,
  ): Promise<CartOutput[]> {
    return await this.cartService.getCarts(userId, cartId);
  }

  @Delete('/:cartId')
  async deleteProduct(@Param('cartId') cartId: string): Promise<any> {
    return await this.cartService.deleteCart(cartId);
  }
}
