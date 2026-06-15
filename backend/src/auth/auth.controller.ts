import { Controller, Post, Body, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ email: dto.email, password: hash });
    // exclude password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user as any;
    return result;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return tokens;
  }

  @Post('logout')
  async logout(@Body('userId') userId: number) {
    await this.authService.logout(userId);
    return { success: true };
  }
}
