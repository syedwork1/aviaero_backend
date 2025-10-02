import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { CategoryEntity } from "../../../database/entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>
  ) {}

  create(createCategoryData: CreateCategoryDto) {
    return this.categoryEntityRepository.save(createCategoryData);
  }

  bulkCreate(entities: CreateCategoryDto[]) {
    return this.categoryEntityRepository.save(entities);
  }

  findAll(
    where?:
      | FindOptionsWhere<CategoryEntity>
      | FindOptionsWhere<CategoryEntity>[]
  ) {
    return this.categoryEntityRepository.find({
      ...(where ? { where } : {}),
      order: { createAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<CategoryEntity | null> {
    return await this.categoryEntityRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryEntityRepository.findOne({
      where: { id },
    });
    if (!category) return null;

    Object.assign(category, dto);
    return this.categoryEntityRepository.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.categoryEntityRepository.delete(id);
    return result.affected > 0;
  }
}
