import {
  Controller,
  Get,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';
import { PassportJwtAuthGuard } from 'src/common/guards/passport-jwt.guard';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/register')
  create(@Body() registerDto: RegisterDto) {
    return this.usersService.createUser(registerDto);
  }

  @Get()
  getAllUsers() {
    const user = this.usersService.getAllUsers();
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    const user = await this.usersService.findUserById(userId);

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
