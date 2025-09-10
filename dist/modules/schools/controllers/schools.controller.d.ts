import { SchoolsService } from '../services/schools.service';
import { CreateSchoolDto } from '../dto/create-school.dto';
import { UpdateSchoolDto } from '../dto/update-school.dto';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    create(createSchoolDto: CreateSchoolDto): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/school.entity").SchoolEntity;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/school.entity").SchoolEntity[];
        total?: number;
        page?: number;
        limit?: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/school.entity").SchoolEntity;
    }>;
    update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../../database/entities/school.entity").SchoolEntity;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
