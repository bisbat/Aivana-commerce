import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email: string = profile.emails?.[0]?.value;
    const firstName: string =
      profile.name?.givenName ?? profile.displayName ?? 'User';
    const lastName: string = profile.name?.familyName ?? '';
    const avatarUrl: string | null = profile.photos?.[0]?.value ?? null;

    const signInData = await this.authService.googleLogin({
      email,
      firstName,
      lastName,
      avatarUrl,
    });

    done(null, signInData);
  }
}
