import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourceDto } from "../dto/create-cource.dto";
import { UpdateCourceDto } from "../dto/update-cource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CourceEntity } from "../../../database/entities/cource.entity";
import { CategoryService } from "../../category/services/category.service";
import { CategoryEntity } from "../../../database/entities/category.entity";

@Injectable()
export class CourcesService {
  constructor(
    @InjectRepository(CourceEntity)
    private readonly courceRepository: Repository<CourceEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly categoryService: CategoryService
  ) {}

  async create(createCourseDto: CreateCourceDto): Promise<CourceEntity> {
    try {
      const { categoryIds, ...courseData } = createCourseDto;
      const course = this.courceRepository.create({
        ...courseData,
        category: categoryIds.map((c) => ({ id: c })),
      });
      return this.courceRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException({
        message: "Failed to create course",
        error: error.message,
      });
    }
  }

  async findAll(): Promise<CourceEntity[]> {
    try {
      return this.courceRepository.find({
        relations: ["category"],
        order: { createAt: "DESC" },
      });
    } catch (error) {
      // Log the original error for debugging if needed
      console.error("Database error fetching courses:", error);
      throw new InternalServerErrorException("Failed to fetch courses");
    }
  }

  async findOne(id: string): Promise<CourceEntity> {
    try {
      const course = await this.courceRepository.findOne({
        where: { id },
        relations: ["category"],
      });
      if (!course) {
        throw new NotFoundException(`Course with id ${id} not found`);
      }
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error("Database error fetching course:", error);
      throw new InternalServerErrorException("Failed to fetch course");
    }
  }

  async update(id: string, dto: UpdateCourceDto) {
    const { categoryIds, ...data } = dto;
    const cource = await this.courceRepository.findOne({ where: { id } });
    if (!cource) {
      throw new Error(`Cource with id ${id} not found!`);
    }

    const categories = await this.categoryRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    Object.assign(cource, data);
    cource.category = categories;
    await cource.save();
    return cource;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.courceRepository.delete(id);
    return result.affected > 0;
  }
}
