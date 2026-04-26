import { Role } from "../enum/role.enum";

export interface JwtPayload {
  role: Role;
  sub: string;
  iat?: number;
  exp?: number;
}
