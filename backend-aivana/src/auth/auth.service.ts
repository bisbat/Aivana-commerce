import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/constants/user-roles.enum';

type AuthInput = { username: string; password: string };
type SignInData = { userId: string; username: string; role: UserRoles }; // Added role
type AuthResult = {
  accessToken: string;
  userId: string;
  username: string;
  role: UserRoles;
}; // Added role

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findUserByName(input.username);

    if (user && user.password === input.password) {
      // const { password, ...result } = user;
      return {
        userId: user.id,
        username: user.username,
        role: user.role, // Added role
      };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
      role: user.role, // Optional: add role to token payload too
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      username: user.username,
      userId: user.userId,
      role: user.role, // Added role to return
    };
  }
}
