import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpException,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { ExamService } from "../services/exam.service";
import { CreateExamDto } from "../dto/create-exam.dto";
import { UpdateExamDto } from "../dto/update-exam.dto";
import {
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/gaurds/roles.decorator";
import { Role } from "@core/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExamBulkCreationService } from "../services/bulk.service";

@ApiTags("exam")
@Controller("exam")
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly bulkService: ExamBulkCreationService
  ) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiBody({ type: CreateExamDto })
  async create(@Request() req, @Body() createExamDto: CreateExamDto) {
    try {
      await this.examService.create(createExamDto, req.user.userId);

      return {
        statusCode: 200,
        message: "Exam has been created successfully",
      };
    } catch (error) {
      // Optional: log the error for debugging
      console.error("Exam creation failed:", error);

      // If the service threw a known HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise wrap in a generic 500 Internal Server Error
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to create exam. Please try again later.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by") sortBy: string,
    @Query("query") query: string
  ) {
    return this.examService.findAll(page, limit, sortBy, query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.examService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.examService.remove(+id);
  }

  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @Post("csvCreateQuestion/upload")
  @UseInterceptors(FileInterceptor("file"))
  public async upload(@UploadedFile() file: Express.Multer.File) {
    return this.bulkService.bulkCreation(file);
  }
}
