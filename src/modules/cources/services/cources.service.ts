import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCourceDto } from "../dto/create-cource.dto";
import { UpdateCourceDto } from "../dto/update-cource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, In, Repository } from "typeorm";
import { CourceEntity } from "../../../database/entities/cource.entity";
import { CategoryService } from "../../category/services/category.service";
import { CategoryEntity } from "../../../database/entities/category.entity";

@Injectable()
export class CourcesService {
  constructor(
    @InjectRepository(CourceEntity)
    private readonly courceRepository: Repository<CourceEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
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

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const [data, total] = await this.courceRepository.findAndCount({
      ...(query ? { where: { name: ILike(`%query%`) } } : {}),
      relations: ["category"],
      take: limit ? limit : undefined,
      skip: page * limit,
      order: { [sortBy]: "DESC" },
    });
    return {
      data,
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
      sortBy,
      query,
      total,
    };
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
