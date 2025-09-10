import { CreateSchoolStudentDto } from '../dto/create-school-student.dto';
import { UpdateSchoolStudentDto } from '../dto/update-school-student.dto';
import { SchoolStudentEntity } from '../../../database/entities/school-student.entity';
import { Repository } from 'typeorm';
export declare class SchoolStudentsService {
    private readonly SchoolStudentRepository;
    constructor(SchoolStudentRepository: Repository<SchoolStudentEntity>);
    create(createSchoolStudentDto: CreateSchoolStudentDto): Promise<{
        success: boolean;
        message: string;
        data: SchoolStudentEntity[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSchoolStudentDto: UpdateSchoolStudentDto): string;
    remove(id: number): string;
}
