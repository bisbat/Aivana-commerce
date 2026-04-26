import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { SignInData } from 'src/auth/interfaces/sign-in-data.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<SignInData> {
    const user = await this.authService.validateUser({ username, password });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
