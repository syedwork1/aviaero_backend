"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const question_entity_1 = require("../../../database/entities/question.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
let QuestionsService = class QuestionsService {
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    async create(createQuestionDto) {
        try {
            const savedQuestion = await this.questionRepository.save({
                ...createQuestionDto,
            });
            return {
                success: true,
                message: 'Question created successfully',
                data: savedQuestion,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to create question',
            };
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.questionRepository.find({
                    skip,
                    take: limit,
                }),
                this.questionRepository.count(),
            ]);
            return {
                success: true,
                message: 'Questions fetched successfully',
                data,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch questions ',
            };
        }
    }
    async findOne(id) {
        try {
            const question = await this.questionRepository.findOne({ where: { id } });
            if (!question) {
                return {
                    success: false,
                    message: `Question with id ${id} not found`,
                };
            }
            return {
                success: true,
                message: 'Question fetched successfully',
                data: question,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch question ',
            };
        }
    }
    async update(id, updateQuestionDto) {
        try {
            const question = await this.questionRepository.findOne({ where: { id } });
            if (!question) {
                throw new common_2.NotFoundException(`Question with id ${id} not found`);
            }
            const updatePayload = {
                question: updateQuestionDto.question,
                option_A: updateQuestionDto.option_A,
                option_B: updateQuestionDto.option_B,
                option_C: updateQuestionDto.option_C,
                option_D: updateQuestionDto.option_D,
                correct_answer: updateQuestionDto.correct_answer,
                explanation: updateQuestionDto.explanation,
                subscription_level: updateQuestionDto.subscription_level,
                is_exam_question: updateQuestionDto.is_exam_question,
                difficulty: updateQuestionDto.difficulty,
                CBR_chapter: updateQuestionDto.CBR_chapter,
            };
            await this.questionRepository.update(id, updatePayload);
            const updatedQuestion = await this.questionRepository.findOne({ where: { id } });
            return {
                success: true,
                message: 'Question updated successfully',
                data: updatedQuestion,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update question',
            };
        }
    }
    async remove(id) {
        try {
            const question = await this.questionRepository.findOne({ where: { id } });
            if (!question) {
                throw new common_2.NotFoundException(`Question with id ${id} not found`);
            }
            await this.questionRepository.remove(question);
            return {
                success: true,
                message: 'Question removed successfully ',
                data: question,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to remove question',
            };
        }
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.QuestionsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map