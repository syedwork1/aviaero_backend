import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
export declare class CategoryService {
    private readonly categoryEntityRepository;
    constructor(categoryEntityRepository: Repository<CategoryEntity>);
    create(createCategoryDto: CreateCategoryDto): Promise<CreateCategoryDto & CategoryEntity>;
    findAll(): Promise<CategoryEntity[]>;
    findOne(id: number): string;
    update(id: number, updateCategoryDto: UpdateCategoryDto): string;
    remove(id: number): string;
}
