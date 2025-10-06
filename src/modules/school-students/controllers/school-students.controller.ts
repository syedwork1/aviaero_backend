import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SchoolStudentsService } from "../services/school-students.service";
import { CreateSchoolStudentDto } from "../dto/create-school-student.dto";
import { UpdateSchoolStudentDto } from "../dto/update-school-student.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("school-students")
@Controller("school-students")
export class SchoolStudentsController {
  constructor(private readonly schoolStudentsService: SchoolStudentsService) {}

  @Post()
  create(@Body() createSchoolStudentDto: CreateSchoolStudentDto) {
    return this.schoolStudentsService.create(createSchoolStudentDto);
  }

  @Get()
  findAll() {
    return this.schoolStudentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.schoolStudentsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSchoolStudentDto: UpdateSchoolStudentDto
  ) {
    return this.schoolStudentsService.update(+id, updateSchoolStudentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.schoolStudentsService.remove(+id);
  }
}
