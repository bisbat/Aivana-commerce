import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Request} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input:{username: string; password: string}){
    return this.authService.authenticate(input);
  }


}
