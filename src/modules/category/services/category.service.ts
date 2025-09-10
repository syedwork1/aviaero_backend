import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';

@Injectable()
export class CategoryService {

   constructor(
            @InjectRepository(CategoryEntity)
            private readonly categoryEntityRepository: Repository<CategoryEntity>,
          ) {}

  create(createCategoryDto: CreateCategoryDto) {
   return this.categoryEntityRepository.save(createCategoryDto)
  }

  findAll() {
  return this.categoryEntityRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
