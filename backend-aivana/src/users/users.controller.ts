import { Controller, Get, Post, Body, Request, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(Role.ADMIN)
  getAllUsers() {
    const user = this.usersService.getAllUsers();
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/:userId')
  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  async getUserById(@Request() req): Promise<ResponseUserDto> {
    const { userId } = req.params;
    const user = await this.usersService.findUserById(userId);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Put('/:userId')
  @Roles(Role.SELLER, Role.CUSTOMER)
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('email:', updateUserDto.email);

    const updatedUser = await this.usersService.updateUser(userId, updateUserDto);

    return plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

}