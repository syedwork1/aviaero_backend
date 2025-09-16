import { Module } from '@nestjs/common';
import { ExamService } from './services/exam.service';
import { ExamController } from './controllers/exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from '../../database/entities/exam.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
   imports: [TypeOrmModule.forFeature([ExamEntity]), ConfigModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
