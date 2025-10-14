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

@ApiTags("questions")
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // create single question on admin side
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("/single")
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
    @Query("query") query: string
  ) {
    return this.questionsService.findAll(page, limit, sortBy, query);
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

  // Question insertion through CSV in the database
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

      console.log(errors, "errors", data[0]);

      const headers = Object.keys(data[0] || {})?.map((h) => h.toLowerCase());
      const isValidCsv = expectedHeaders.every((header) =>
        headers.includes(header.toLowerCase())
      );

      console.log(isValidCsv);

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
