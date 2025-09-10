import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { Repository } from 'typeorm';
import { SubjectEntity } from '../../../database/entities/subject.entity';
export declare class SubjectService {
    private readonly SubjectEntityRepository;
    constructor(SubjectEntityRepository: Repository<SubjectEntity>);
    create(createSubjectDto: CreateSubjectDto): Promise<CreateSubjectDto & SubjectEntity>;
    findAll(): Promise<SubjectEntity[]>;
    findOne(id: number): string;
    update(id: number, updateSubjectDto: UpdateSubjectDto): string;
    remove(id: number): string;
}
