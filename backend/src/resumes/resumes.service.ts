import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ResumesService {
  constructor(@InjectRepository(Resume) private resumeRepo: Repository<Resume>) {}

  create(user: User, data: any) {
    const r = this.resumeRepo.create({ user, data });
    return this.resumeRepo.save(r);
  }

  async update(id: number, data: any) {
    const resume = await this.resumeRepo.findOne({ where: { id }, relations: ['user'] });
    if (!resume) {
      return null;
    }
    resume.data = data;
    return this.resumeRepo.save(resume);
  }

  findByUserId(userId: number) {
    return this.resumeRepo.find({ where: { user: { id: userId } } , relations: ['user']});
  }

  findById(id: number) {
    return this.resumeRepo.findOne({ where: { id }, relations: ['user'] });
  }

  delete(id: number) {
    return this.resumeRepo.delete(id);
  }
}
