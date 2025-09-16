import { Controller, Get, Post, Body, Patch, Param, Delete ,HttpException,HttpStatus,UseGuards} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
 import { JwtAuthGuard } from '@core/gaurds/jwt-auth.gaurd';
  import { RolesGuard } from '@core/gaurds/roles.guard';
  import { Roles } from '@core/gaurds/roles.decorator';
  import { Role } from '@core/enums/role.enum';


@ApiTags('category')
@Controller('category')

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }


   @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }


   @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
 @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoryService.findOne(id);

      if (!category) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Category not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: `Category #${id} fetched successfully`,
        data: category,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to fetch category',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


   @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const updated = await this.categoryService.update(id, updateCategoryDto);

      if (!updated) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Category not found' },
          HttpStatus.NOT_FOUND,
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
          message: 'Failed to update category',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


   @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
   @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.categoryService.remove(id);
      if (!deleted) {
        // Nothing was deleted → 404
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Course not found' },
          HttpStatus.NOT_FOUND,
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
          message: 'Failed to delete course',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
