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
} from "@nestjs/common";
import { ExamService } from "../services/exam.service";
import { CreateExamDto } from "../dto/create-exam.dto";
import { UpdateExamDto } from "../dto/update-exam.dto";
import { ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/gaurds/roles.decorator";
import { Role } from "@core/enums/role.enum";

@ApiTags("exam")
@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post()
  @ApiBody({ type: CreateExamDto })
  async create(@Request() req, @Body() createExamDto: CreateExamDto) {
    try {
      await this.examService.create(createExamDto, req.user.user_id);

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

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Get("/all/:page/:limit")
  findAll(
    @Request() req,
    @Param("page") page: string = "1",
    @Param("limit") limit: string = "10"
  ) {
    return this.examService.findAll(
      req.user.user_id,
      Number(page),
      Number(limit)
    );
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
}
