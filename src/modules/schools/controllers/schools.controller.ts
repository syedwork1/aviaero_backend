import { Controller, Get, Post, Body, Patch, Param, Delete,Query,UseGuards } from '@nestjs/common';
import { SchoolsService } from '../services/schools.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/gaurds/jwt-auth.gaurd';
import { Roles } from '@core/gaurds/roles.decorator';
import { RolesGuard } from '@core/gaurds/roles.guard';
import { Role } from '@core/enums/role.enum';


@ApiTags('School')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}



  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }


  // get all schools with pagination
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query('page') page: number = 1,
     @Query('limit') limit: number = 10,
  ) {
    return this.schoolsService.findAll(Number(page), Number(limit));
  }

  //get single School
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }
}
