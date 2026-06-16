import { Controller, Post, UseGuards, Body, Request, Get, Param, ForbiddenException, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UsersService } from '../users/users.service';
import { extname } from 'path';

@Controller()
export class ResumesController {
  constructor(private resumesService: ResumesService, private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('resumes')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async create(
    @Request() req: any,
    @Body() dto: CreateResumeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = await this.usersService.findById(req.user.userId);
    const resumeData = JSON.parse(dto.data);
    
    if (file) {
      resumeData.photo = `/api/uploads/${file.filename}`;
    }
    
    return this.resumesService.create(user, resumeData);
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

  @UseGuards(AuthGuard('jwt'))
  @Delete('resumes/:id')
  async delete(@Request() req: any, @Param('id') id: string) {
    const resumeId = Number(id);
    const resume = await this.resumesService.findById(resumeId);
    
    if (!resume) {
      throw new ForbiddenException('Resume not found');
    }
    
    if (resume.user.id !== req.user.userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return this.resumesService.delete(resumeId);
  }
}
