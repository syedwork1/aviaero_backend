import { Controller, Get, Post, Body, Patch, Param, Delete ,HttpStatus,InternalServerErrorException,HttpCode,UseGuards} from '@nestjs/common';
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
 import { JwtAuthGuard } from '@core/gaurds/jwt-auth.gaurd';
  import { RolesGuard } from '@core/gaurds/roles.guard';
  import { Roles } from '@core/gaurds/roles.decorator';
  import { Role } from '@core/enums/role.enum';


@ApiTags('subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}


  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    try {
      const subject = await this.subjectService.create(createSubjectDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subject created successfully',
        data: subject,
      };
    } catch (error) {
      // Log and re-throw so Nest’s global filters return a clean JSON error
      console.error('Controller create error:', error);
      throw new InternalServerErrorException('Unable to create subject');
    }
  }


  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const subjects = await this.subjectService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Subjects retrieved successfully',
        data: subjects,
      };
    } catch (error) {
      console.error('Controller findAll error:', error);
      throw new InternalServerErrorException('Unable to fetch subjects');
    }
  }
  
    @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      const subject = await this.subjectService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: `Subject with ID ${id} retrieved successfully`,
        data: subject,
      };
    } catch (error) {
      console.error('Controller findOne error:', error);
      // Service already throws specific exceptions; rethrow to let Nest handle
      throw error instanceof Error ? error : new InternalServerErrorException();
    }
  }
  
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(id, updateSubjectDto);
  }
 

  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) 
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.subjectService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: result.message,
      };
    } catch (error) {
      console.error('Controller remove error:', error);
      throw error instanceof Error ? error : new InternalServerErrorException();
    }
  }
}
