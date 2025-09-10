import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionsEntity } from '../../../database/entities/question.entity';
import { Repository } from 'typeorm';
export declare class QuestionsService {
    private readonly questionRepository;
    constructor(questionRepository: Repository<QuestionsEntity>);
    create(createQuestionDto: CreateQuestionDto): Promise<{
        success: boolean;
        message: string;
        data?: QuestionsEntity;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data?: QuestionsEntity[];
        total?: number;
        page?: number;
        limit?: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: QuestionsEntity;
    }>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        success: boolean;
        message: string;
        data?: QuestionsEntity;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data?: QuestionsEntity;
    }>;
}
