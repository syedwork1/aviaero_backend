import { Module } from '@nestjs/common';
import { SchoolsService } from './services/schools.service';
import { SchoolsController } from './controllers/schools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from '../../database/entities/school.entity';
import { ConfigModule } from '@nestjs/config';

@Module({

 imports: [TypeOrmModule.forFeature([SchoolEntity]), ConfigModule],

  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
