import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/constants/user-roles.enum';
import * as bcrypt from 'bcrypt';

type AuthInput = { username: string; password: string };
type SignInData = { userId: string; username: string; role: UserRoles };  // Added role
type AuthResult = { accessToken: string };  // Added role


@Injectable()
export class AuthService {

  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService, private jwtService: JwtService) { }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user)
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findUserByName(input.username);

    if (!user) return null;

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) return null;

    return {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
      role: user.role  // Optional: add role to token payload too
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken
    };
  }

}
