import { Injectable,InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { SubjectEntity } from '../../../database/entities/subject.entity';

@Injectable()
export class SubjectService {


  constructor(
            @InjectRepository(SubjectEntity)
            private readonly SubjectEntityRepository: Repository<SubjectEntity>,
          ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    try {
      const newSubject = this.SubjectEntityRepository.create(createSubjectDto);
      return await this.SubjectEntityRepository.save(newSubject);
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new InternalServerErrorException('Failed to create subject');
    }
  }

async findAll(): Promise<SubjectEntity[]> {
  try {
    return await this.SubjectEntityRepository.find();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw new InternalServerErrorException('Failed to fetch subjects');
  }
}

   async findOne(id: string): Promise<SubjectEntity> {
    try {
      const subject = await this.SubjectEntityRepository.findOne({ where: { id } });
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }
      return subject;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Service findOne error:', error);
      throw new InternalServerErrorException('Failed to retrieve subject');
    }
  }

 async update(id: string, dto: UpdateSubjectDto): Promise<SubjectEntity> {
    try {
      const subject = await this.SubjectEntityRepository.findOne({ where: { id } });
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }

      const updated = Object.assign(subject, dto);
      return await this.SubjectEntityRepository.save(updated);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Service update error:', error);
      throw new InternalServerErrorException('Failed to update subject');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.SubjectEntityRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }

      return { message: `Subject with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Service remove error:', error);
      throw new InternalServerErrorException('Failed to delete subject');
    }
  }
}
