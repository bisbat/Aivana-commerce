import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from '../common/guards/passport-local.guard';
import { PassportJwtAuthGuard } from '../common/guards/passport-jwt.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Request() request) {
    return this.authService.signIn(request.user);
  }

  @Get('me')
  @UseGuards(PassportJwtAuthGuard)
  getUserInfo(@Request() request) {
    return request.user;
  }
}
