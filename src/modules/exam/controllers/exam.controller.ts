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
  Req,
} from "@nestjs/common";
import { ExamService } from "../services/exam.service";
import {
  CreateExamDto,
  UpdateExamDto,
  BulkUploadExamDto,
  StartExamDto,
  SubmitExamAnswerDto,
  FinishExamDto,
} from "../exam.dto";
import {
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/decorators/roles.decorator";
import { Role } from "@core/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExamBulkCreationService } from "../services/bulk.service";
import { SubscriptionGuard } from "@core/gaurds/subscription.guard";
import { RequireFeature } from "@core/decorators/feature-require.decorator";
import { FeaturesListEnum } from "@core/enums/features.enum";
import { RequestWithUser } from "@core/types/RequestWithUser";
import { ConductExamService } from "../services/conduct-exam.service";

@ApiTags("exam")
@Controller("exam")
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly bulkService: ExamBulkCreationService,
    private readonly conductExamService: ConductExamService
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
    name: "subject_id",
    type: String,
    description: "filter by subject id",
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
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by", new DefaultValuePipe("createAt")) sortBy: string,
    @Query("subject_id") subjectId: string,
    @Query("query") query: string,
    @Req() request: RequestWithUser
  ) {
    return this.examService.findAll(
      page,
      limit,
      sortBy,
      query,
      subjectId,
      request
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
  @ApiBody({ type: BulkUploadExamDto })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @Post("bulk-upload")
  public async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() { courseId }: BulkUploadExamDto
  ) {
    return this.bulkService.bulkCreation(file, courseId);
  }

  @ApiBearerAuth("authorization")
  @Roles(Role.STUDENT)
  @RequireFeature(FeaturesListEnum.examLimit)
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Post("start")
  start(@Body() body: StartExamDto, @Request() req: RequestWithUser) {
    return this.conductExamService.start(body, req);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("submit-answer")
  submitAnswer(@Body() body: SubmitExamAnswerDto) {
    return this.conductExamService.submitAnswer(body);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("finish")
  finish(@Body() body: FinishExamDto) {
    return this.conductExamService.finish(body);
  }
}
