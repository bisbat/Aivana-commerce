import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Request, NotImplementedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(){
    return 'success'
  }

  @Get('me')
  getUserInfo(){
    throw new NotImplementedException
  }

}
