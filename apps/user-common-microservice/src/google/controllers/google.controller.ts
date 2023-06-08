import { Controller, Get,Req,UseGuards,Res, Body } from '@nestjs/common';
import { GoogleService } from '../services/google.service';
import { AuthGuard } from '@nestjs/passport/dist';
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('logout-google')
  logOut(@Req() req, @Res() res, @Body() token: string) {
    res.redirect("http://localhost:3001/login-google")
    return this.googleService.logout(token)
  }     
  @Get('login-google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req){
  }
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req){
    return  this.googleService.googleLogin(req)
  }    
}
