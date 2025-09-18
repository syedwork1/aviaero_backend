import { Injectable ,InternalServerErrorException} from '@nestjs/common';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolEntity } from '../../../database/entities/school.entity';

@Injectable()
export class SchoolsService {

    constructor(
        @InjectRepository(SchoolEntity)
        private readonly schoolRepository: Repository<SchoolEntity>,
      ) {}


      async create(createSchoolDto: CreateSchoolDto): Promise<{
        success: boolean;
        message: string;
        data?: SchoolEntity;
      }> {
        try {
          const school = this.schoolRepository.create(createSchoolDto);
          const savedSchool = await this.schoolRepository.save(school);
    
          return {
            success: true,
            message: 'School created successfully',
            data: savedSchool,
          };
        } catch (error) {
          throw new InternalServerErrorException({
            success: false,
            message: error.message || 'Failed to create school',
          });
        }
      }
    

  async findAll(
      page = 1,
      limit = 10,
    ): Promise<{
      success: boolean;
      message: string;
      data?: SchoolEntity[];
      total?: number;
      page?: number;
      limit?: number;
    }> {
      try {
        const skip = (page - 1) * limit;
    
        const [data, total] = await Promise.all([
          this.schoolRepository.find({
            skip,
            take: limit,
             order: { createAt: 'DESC' },
          }),
          this.schoolRepository.count(), 
        ]);
       
    
        return {
          success: true,
          message: 'Questions fetched successfully',
          data,
          total,
          page,
          limit,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to fetch questions ',
        };
      }
    }

    async findOne(id: string): Promise<{
      success: boolean;
      message: string;
      data?: SchoolEntity;
    }> {
      try {
        const findSingleSchool = await this.schoolRepository.findOne({
          where: { id },
        });
    
        if (!findSingleSchool) {
          return {
            success: false,
            message: `School with id ${id} not found`,
          };
        }
    
        return {
          success: true,
          message: "Single school fetched successfully",
          data: findSingleSchool,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Failed to fetch school",
        };
      }
    }
    

    async update(id: string, updateSchoolDto: UpdateSchoolDto) {
      // Check if school exists
      const findSchool = await this.schoolRepository.findOne({ where: { id } });
    
      if (!findSchool) {
        return {
          success: false,
          message: "School not found"
        };
      }
    
      // Update the school
      await this.schoolRepository.update(id, updateSchoolDto);
    
      // Fetch updated school
      const updatedSchool = await this.schoolRepository.findOne({ where: { id } });
    
      return {
        success: true,
        message: "Successfully updated the School",
        data: updatedSchool,
      };
    }
    

    async remove(id: string) {
      const result = await this.schoolRepository.delete(id);
    
      if (result.affected === 0) {
        return {
          success: false,
          message: "School not found",
        }
      }
    
      return {
        success: true,
        message: "School deleted successfully",
      };
    }






}
