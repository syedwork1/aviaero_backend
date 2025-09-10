import { AppBaseEntity } from './base.entity';
export declare class QuestionsEntity extends AppBaseEntity {
    question: string;
    option_A: string;
    option_B: string;
    option_C: string;
    option_D: string;
    correct_answer: string;
    explanation: string;
    subscription_level: string;
    is_exam_question: boolean;
    difficulty: string;
    CBR_chapter: string;
}
