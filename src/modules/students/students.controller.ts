import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/gaurds/roles.decorator";
import { Role } from "@core/enums/role.enum";

@ApiTags("students")
@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @ApiQuery({
    name: "page",
    type: Number,
    description: "page no",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    description: "page size",
    required: false,
  })
  @ApiQuery({
    name: "sort_by",
    type: String,
    description: "sort by",
    required: false,
  })
  @ApiQuery({
    name: "query",
    type: String,
    description: "search by firstname",
    required: false,
  })
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by") sortBy: string,
    @Query("query") query: string
  ) {
    return this.studentsService.findAll(page, limit, sortBy, query);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentsService.findOne(id);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  // @ApiBearerAuth("authorization")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.studentsService.remove(+id);
  // }
}
