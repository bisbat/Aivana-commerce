import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UseInterceptors, UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common/exceptions';
import type { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() avatar?: UploadedFileType,
  ) {
    if (avatar) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(avatar.mimetype)) {
        throw new BadRequestException(
          'Only image files are allowed (JPEG, PNG, GIF, WebP)',
        );
      }
      const maxSize = 5 * 1024 * 1024;
      if (avatar.size > maxSize) {
        throw new BadRequestException('Avatar file size must not exceed 5MB');
      }
    }

    return this.authService.register(registerDto, avatar);
  }

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

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // This route will redirect to Google for authentication
  }

  @Public()
  @Get('google/cancelled')
  googleCancelled(@Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login?error=google_cancelled`);
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Request() req, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const { accessToken } = await this.authService.signIn(req.user);
    res.redirect(
      `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(accessToken)}`,
    );
  }
}
