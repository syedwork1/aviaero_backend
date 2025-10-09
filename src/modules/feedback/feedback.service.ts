import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FeedbackEntity } from "../../database/entities/feedback.entity";
import { MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {}
  create(createFeedbackDto: CreateFeedbackDto) {
    const feedback = this.feedbackRepository.create({
      feedback: createFeedbackDto.feedback,
      rating: createFeedbackDto.rating,
      student: { id: createFeedbackDto.studentId },
      quiz: { id: createFeedbackDto.quizId },
    });
    return this.feedbackRepository.save(feedback);
  }

  async findAll(page: number, limit: number, sortBy: string, rating: number) {
    const [data, total] = await this.feedbackRepository.findAndCount({
      ...(rating ? { where: { rating: MoreThanOrEqual(rating) } } : {}),
      ...(limit ? { take: limit } : {}),
      skip: page * limit || 0,
      ...(sortBy
        ? {
            order: {
              [sortBy]: "DESC",
            },
          }
        : {}),
    });

    return { data, total };
  }

  findOne(id: string) {
    return this.feedbackRepository.findOne({
      where: { id },
      relations: ["quiz"],
      relationLoadStrategy: "join",
    });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const feedbackEntity = await this.feedbackRepository.findOne({
      where: { id },
    });
    if (!feedbackEntity) {
      throw new NotFoundException(
        `Feedback data not found with this id: ${id}`
      );
    }
    const { feedback, rating, studentId, quizId } = updateFeedbackDto;

    const updatedFeedback = this.feedbackRepository.create({
      ...(feedback ? { feedback } : {}),
      ...(rating ? { rating } : {}),
      ...(studentId ? { student: { id: studentId } } : {}),
      ...(quizId ? { quiz: { id: quizId } } : {}),
    });
    return this.feedbackRepository.update({ id }, updatedFeedback);
  }

  remove(id: string) {
    return this.feedbackRepository.delete({ id });
  }
}
