import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './config/jwt-secret';
import { PassportModule } from '@nestjs/passport';
import { PassportAuthController } from './passport-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule,JwtModule.register({
    global:true,
    secret: JWT_SECRET,
    signOptions: {expiresIn: '1d'}
  }),
  PassportModule
],
  controllers: [PassportAuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
