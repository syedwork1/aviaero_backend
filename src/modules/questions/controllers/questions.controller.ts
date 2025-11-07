import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
  ParseBoolPipe,
} from "@nestjs/common";
import { QuestionsService } from "../services/questions.service";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { UpdateQuestionDto } from "../dto/update-question.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { Query } from "@nestjs/common";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { Roles } from "@core/gaurds/roles.decorator";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Role } from "@core/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import {
  FixQuestionReportDto,
  FixQuestionReportStatusEnum,
  ReportQuestionDto,
} from "../dto/report-question.dto";

@ApiTags("questions")
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // create single question on admin side
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("single")
  @Roles(Role.ADMIN)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  // get all questions
  @Roles(Role.ADMIN)
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
    name: "reported_only",
    type: Boolean,
    description: "reported only question",
    required: false,
  })
  @ApiQuery({
    name: "query",
    type: String,
    description: "search by question",
    required: false,
  })
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by", new DefaultValuePipe("createAt")) sortBy: string,
    @Query("reported_only", new DefaultValuePipe(false), ParseBoolPipe)
    reportedOnly: boolean,
    @Query("query") query: string
  ) {
    return this.questionsService.findAll(
      page,
      limit,
      sortBy,
      query,
      reportedOnly
    );
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/difficulties")
  @Roles(Role.ADMIN)
  difficulties() {
    return this.questionsService.difficulties();
  }

  // get question through question Id
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/:id")
  @Roles(Role.ADMIN)
  findOne(@Param("id") id: string) {
    return this.questionsService.findOne(id);
  }

  // update the questions
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/update/:id")
  @Roles(Role.ADMIN)
  update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  // delete the questions
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete("/:id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.questionsService.remove(id);
  }

  @Roles(Role.ADMIN)
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
    name: "status",
    enum: FixQuestionReportStatusEnum,
    description: "filter by status",
    required: false,
  })
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("report/all")
  findAllReports(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by", new DefaultValuePipe("createAt")) sortBy: string,
    @Query("status") status: string
  ) {
    return this.questionsService.findAllReports(page, limit, sortBy, status);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post("/report/:id")
  report(
    @Req() req: any,
    @Param("id") questionId: string,
    @Body() body: ReportQuestionDto
  ) {
    return this.questionsService.report(req.user, questionId, body);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("/fix-report/:id")
  fixReport(
    @Req() req: any,
    @Param("id") reportId: string,
    @Body() { status }: FixQuestionReportDto
  ) {
    return this.questionsService.updateReport(reportId, status);
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
    if (!file) {
      throw new ForbiddenException("Please select a CSV file.");
    }
    const expectedHeaders = [
      "Vraag",
      "antwoord A",
      "Antwoord B",
      "Antwoord C",
      "Antwoord D",
      "Correct antwoord",
      "Uitleg",
      "Categorie",
      "Moeilijkheid",
      "CBR-code",
      "Membership",
    ];

    try {
      const { data, errors } = await this.questionsService.readCsvFromBuffer(
        file.buffer
      );

      if (errors.length) {
        throw new ForbiddenException("Error processing CSV file.");
      }

      const headers = Object.keys(data[0] || {})?.map((h) => h.toLowerCase());
      const isValidCsv = expectedHeaders.every((header) =>
        headers.includes(header.toLowerCase())
      );

      if (!isValidCsv) {
        throw new ForbiddenException(
          "Invalid CSV file format. Please upload the correct CSV file."
        );
      }

      return {
        Message: "Successful",
        payload: await this.questionsService.upload(file),
      };
    } catch (error) {
      throw new ForbiddenException(
        error.message || "Failed to process CSV file."
      );
    }
  }
}
