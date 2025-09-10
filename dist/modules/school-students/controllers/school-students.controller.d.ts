import { SchoolStudentsService } from '../services/school-students.service';
import { CreateSchoolStudentDto } from '../dto/create-school-student.dto';
import { UpdateSchoolStudentDto } from '../dto/update-school-student.dto';
export declare class SchoolStudentsController {
    private readonly schoolStudentsService;
    constructor(schoolStudentsService: SchoolStudentsService);
    create(createSchoolStudentDto: CreateSchoolStudentDto): Promise<{
        success: boolean;
        message: string;
        data: import("../../../database/entities/school-student.entity").SchoolStudentEntity[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSchoolStudentDto: UpdateSchoolStudentDto): string;
    remove(id: string): string;
}
