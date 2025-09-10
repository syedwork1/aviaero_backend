import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    create(createSubjectDto: CreateSubjectDto): Promise<CreateSubjectDto & import("../../../database/entities/subject.entity").SubjectEntity>;
    findAll(): Promise<import("../../../database/entities/subject.entity").SubjectEntity[]>;
    findOne(id: string): string;
    update(id: string, updateSubjectDto: UpdateSubjectDto): string;
    remove(id: string): string;
}
