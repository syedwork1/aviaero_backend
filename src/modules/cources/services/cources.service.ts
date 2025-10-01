import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourceDto } from "../dto/create-cource.dto";
import { UpdateCourceDto } from "../dto/update-cource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourceEntity } from "../../../database/entities/cource.entity";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class CourcesService {
  constructor(
    @InjectRepository(CourceEntity)
    private readonly courceRepository: Repository<CourceEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async create(createCourseDto: CreateCourceDto): Promise<CourceEntity> {
    try {
      const category = await this.categoryService.findOne(
        createCourseDto.categoryId
      );

      if (!category) {
        throw new NotFoundException(
          `Category with id ${createCourseDto.categoryId} not found!`
        );
      }

      const course = this.courceRepository.create({
        ...createCourseDto,
        category,
      });
      await this.courceRepository.save(course);
      return course;
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
    const cource = await this.courceRepository.findOne({ where: { id } });
    if (!cource) return null;

    const category = await this.categoryService.findOne(dto.categoryId);

    if (!category) {
      throw new Error(`Category with id ${dto.categoryId} not found!`);
    }

    Object.assign(cource, dto);
    return this.courceRepository.save({ ...cource, category });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.courceRepository.delete(id);
    return result.affected > 0;
  }
}
