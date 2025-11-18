import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  Repository,
} from "typeorm";
import { CategoryEntity } from "../../../database/entities/category.entity";
import { RequestWithUser } from "@core/types/RequestWithUser";

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

  async findAll(
    where?:
      | FindOptionsWhere<CategoryEntity>
      | FindOptionsWhere<CategoryEntity>[],
    page?: number,
    limit?: string,
    sortBy?: string,
    query?: string,
    req?: RequestWithUser
  ) {
    let whereObj = {};
    if (where) {
      whereObj = { ...where };
    }
    if (query) {
      whereObj = { ...whereObj, name: ILike(`%${query}%`) };
    }
    if (req?.plan?.subject !== null) {
      whereObj = { ...whereObj, cource: { id: req.plan.subject.id } };
    }

    const [categories, total] =
      await this.categoryEntityRepository.findAndCount({
        ...(Object.keys(whereObj).length ? { where: whereObj } : {}),
        ...(page ? { skip: page * parseInt(limit) } : {}),
        ...(limit ? { take: parseInt(limit) } : {}),
        ...(sortBy ? { order: { [sortBy]: "DESC" } } : {}),
      });

    return { categories, total };
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
