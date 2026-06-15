import { Controller, Post, UseGuards, Body, Request, Get, Param, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UsersService } from '../users/users.service';

@Controller()
export class ResumesController {
  constructor(private resumesService: ResumesService, private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('resumes')
  async create(@Request() req: any, @Body() dto: CreateResumeDto) {
    const user = await this.usersService.findById(req.user.userId);
    return this.resumesService.create(user, dto.data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:id/resumes')
  async getByUser(@Request() req: any, @Param('id') id: string) {
    const userId = Number(id);
    if (req.user.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.resumesService.findByUserId(userId);
  }
}
