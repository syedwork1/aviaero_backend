import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsEntity } from '../../../database/entities/question.entity';
import {  Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class QuestionsService {
    constructor(
      @InjectRepository(QuestionsEntity)
      private readonly questionRepository: Repository<QuestionsEntity>,
    ) {}

    async create(createQuestionDto: CreateQuestionDto): Promise<{
      success: boolean;
      message: string;
      data?: QuestionsEntity;
    }> {
      try {
        const savedQuestion = await this.questionRepository.save({
          ...createQuestionDto,
        });
    
        return {
          success: true,
          message: 'Question created successfully',
          data: savedQuestion,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to create question',
        };
      }
    }

  
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity[];
    total?: number;
    page?: number;
    limit?: number;
  }> {
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
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch questions ',
      };
    }
  }

  async findOne(id: string): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
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
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch question ',
      };
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const question = await this.questionRepository.findOne({ where: { id } });
  
      if (!question) {
        throw new NotFoundException(`Question with id ${id} not found`);
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
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update question',
      };
    }
  }



  async remove(id: string): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const question = await this.questionRepository.findOne({ where: { id } });
  
      if (!question) {
        throw new NotFoundException(`Question with id ${id} not found`);
      }
  
      await this.questionRepository.remove(question);
  
      return {
        success: true,
        message: 'Question removed successfully ',
        data: question,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove question',
      };
    }
  }
}
