import { Module } from '@nestjs/common';
import { SubjectService } from './services/subject.service';
import { SubjectController } from './controllers/subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from '../../database/entities/subject.entity';
import { ConfigModule } from '@nestjs/config';

@Module({


 imports: [TypeOrmModule.forFeature([SubjectEntity]), ConfigModule],


  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
