import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.query?.error) {
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
      response.redirect(`${frontendUrl}/login?error=google_cancelled`);
      return false;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
