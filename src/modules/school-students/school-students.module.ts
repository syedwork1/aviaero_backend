import { Module } from '@nestjs/common';
import { SchoolStudentsService } from './services/school-students.service';
import { SchoolStudentsController } from './controllers/school-students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolStudentEntity } from '../../database/entities/school-student.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
   imports: [TypeOrmModule.forFeature([SchoolStudentEntity]), ConfigModule],
  controllers: [SchoolStudentsController],
  providers: [SchoolStudentsService],
})
export class SchoolStudentsModule {}
