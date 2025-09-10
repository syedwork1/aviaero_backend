import { Injectable } from '@nestjs/common';
import { CreateSchoolStudentDto } from '../dto/create-school-student.dto';
import { UpdateSchoolStudentDto } from '../dto/update-school-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolStudentEntity } from '../../../database/entities/school-student.entity';
import {  Repository } from 'typeorm';
@Injectable()
export class SchoolStudentsService {


   constructor(
          @InjectRepository(SchoolStudentEntity)
          private readonly SchoolStudentRepository: Repository<SchoolStudentEntity>,
        ) {}

        async create(createSchoolStudentDto: CreateSchoolStudentDto) {
          try {
            const { schoolId, studentIds, subjectId, categoryId, enrolmentDate } = createSchoolStudentDto;
            const records = studentIds.map(studentId => ({
              schoolId,
              studentId,
              subjectId,
              categoryId,
              enrolmentDate,
            }));

            // Create instance
            const newSchoolStudent = this.SchoolStudentRepository.create(records);
      
          
            const savedSchoolStudent = await this.SchoolStudentRepository.save(newSchoolStudent);
      
            return {
              success: true,
              message: 'School student added successfully',
              data: savedSchoolStudent,
            };
          } catch (error) {
            return {
              success: false,
              message: 'Failed to add school student',
              error: error.message,
            };
          }
        }

  findAll() {
    return `This action returns all schoolStudents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolStudent`;
  }

  update(id: number, updateSchoolStudentDto: UpdateSchoolStudentDto) {
    return `This action updates a #${id} schoolStudent`;
  }

  remove(id: number) {
    return `This action removes a #${id} schoolStudent`;
  }
}
