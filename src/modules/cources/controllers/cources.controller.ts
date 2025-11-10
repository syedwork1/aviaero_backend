import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { CourcesService } from "../services/cources.service";
import { CreateCourceDto } from "../dto/create-cource.dto";
import { UpdateCourceDto } from "../dto/update-cource.dto";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/gaurds/roles.decorator";
import { Role } from "@core/enums/role.enum";

@ApiTags("courses")
@Controller("cources")
export class CourcesController {
  constructor(private readonly courcesService: CourcesService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createCourceDto: CreateCourceDto) {
    try {
      const course = await this.courcesService.create(createCourceDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: "Course created successfully",
        data: course,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to create course",
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
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
    description: "search by name",
    required: false,
  })
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("sort_by", new DefaultValuePipe("createAt")) sortBy: string,
    @Query("query") query: string
  ) {
    return this.courcesService.findAll(page, limit, sortBy, query);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const course = await this.courcesService.findOne(id);
      return {
        statusCode: 200,
        message: "Course retrieved successfully",
        data: course,
      };
    } catch (error) {
      // Preserve known NestJS exceptions
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw error; // NotFoundException or others bubble up
    }
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCourceDto: UpdateCourceDto
  ) {
    try {
      const updated = await this.courcesService.update(id, updateCourceDto);

      if (!updated) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: "Category not found" },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: `Category #${id} updated successfully`,
        data: updated,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to update category",
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      const deleted = await this.courcesService.remove(id);
      if (!deleted) {
        // Nothing was deleted → 404
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: "Course not found" },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: `Course #${id} deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to delete course",
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
