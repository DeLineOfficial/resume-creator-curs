import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  create(user: Partial<User>) {
    const u = this.usersRepo.create(user as User);
    return this.usersRepo.save(u);
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async setCurrentRefreshToken(hashedToken: string, userId: number) {
    await this.usersRepo.update(userId, { refreshToken: hashedToken } as any);
  }

  async removeRefreshToken(userId: number) {
    await this.usersRepo.update(userId, { refreshToken: null } as any);
  }
}
