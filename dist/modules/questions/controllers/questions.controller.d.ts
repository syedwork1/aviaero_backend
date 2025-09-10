import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(createQuestionDto: CreateQuestionDto): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/question.entity").QuestionsEntity;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/question.entity").QuestionsEntity[];
        total?: number;
        page?: number;
        limit?: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/question.entity").QuestionsEntity;
    }>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/question.entity").QuestionsEntity;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data?: import("../../../database/entities/question.entity").QuestionsEntity;
    }>;
}
