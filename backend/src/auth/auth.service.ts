import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // exclude password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', secret: process.env.JWT_REFRESH_SECRET || 'refreshchangeme' });

    // store hashed refresh token
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setCurrentRefreshToken(hash, user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'refreshchangeme' });
      const userId = payload.sub;
      const user = await this.usersService.findById(userId);
      if (!user || !user.refreshToken) return null;
      const match = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!match) return null;

      // issue new tokens (rotate)
      const newAccess = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
      const newRefresh = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', secret: process.env.JWT_REFRESH_SECRET || 'refreshchangeme' });
      const newHash = await bcrypt.hash(newRefresh, 10);
      await this.usersService.setCurrentRefreshToken(newHash, user.id);

      return { access_token: newAccess, refresh_token: newRefresh };
    } catch (e) {
      return null;
    }
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }
}
