import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enum/role.enum";
import { Reflector } from "@nestjs/core/services/reflector.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // route นี้ไม่จำกัด role
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}
