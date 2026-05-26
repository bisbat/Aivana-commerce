import {
  Controller,
  Get,
  Body,
  Request,
  Put,
  Param,
  NotFoundException,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import type { UploadedFileType } from '../product/interfaces/uploaded-file.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  getAllUsers() {
    const user = this.userService.getAllUsers();
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/:userId')
  @Roles(Role.ADMIN, Role.SELLER, Role.CUSTOMER)
  async getUserById(@Request() req): Promise<ResponseUserDto> {
    const { userId } = req.params;
    const user = await this.userService.findUserById(userId);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Put('/:userId')
  @Roles(Role.SELLER, Role.CUSTOMER)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar?: UploadedFileType,
    @Request() req?: any,
  ) {
    if (req.user.userId !== userId) {
      throw new ForbiddenException('You can only edit your own profile');
    }

    const updatedUser = await this.userService.updateUser(
      userId,
      updateUserDto,
      avatar,
    );

    return plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
