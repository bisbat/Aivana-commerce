import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(private userService: UsersService) { }

  async authenticate(email: string, pass: string ): Promise<any>{
    const user = await this.validateUser(email,pass);

    if (!user){
      throw new UnauthorizedException();
    }

    return 
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}
