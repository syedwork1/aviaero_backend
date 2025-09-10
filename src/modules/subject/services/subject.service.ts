import { Injectable } from '@nestjs/common';
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

  create(createSubjectDto: CreateSubjectDto) {
    return this.SubjectEntityRepository.save(createSubjectDto)
  }

  findAll() {
    return this.SubjectEntityRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
