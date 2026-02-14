import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class PassportJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // For public routes, try to authenticate but don't throw error if it fails
    if (isPublic) {
      try {
        await super.canActivate(context);
      } catch (err) {
        // Silent fail for public routes - user will just be undefined
      }
      return true;
    }

    // For protected routes, throw error if authentication fails
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If public route and no user, allow but don't set user
    if (isPublic) {
      return user || null; // Return user if available, null otherwise
    }

    // For protected routes, throw error if no user
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
