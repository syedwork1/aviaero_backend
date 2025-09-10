import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
import { Repository } from 'typeorm';
import { SchoolEntity } from '../../../database/entities/school.entity';
export declare class SchoolsService {
    private readonly schoolRepository;
    constructor(schoolRepository: Repository<SchoolEntity>);
    create(createSchoolDto: CreateSchoolDto): Promise<{
        success: boolean;
        message: string;
        data?: SchoolEntity;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data?: SchoolEntity[];
        total?: number;
        page?: number;
        limit?: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: SchoolEntity;
    }>;
    update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: SchoolEntity;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
