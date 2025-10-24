import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PlanEntity } from "../../database/entities/plan.entity";
import { ILike, Repository } from "typeorm";
import { ActivatePlanDto } from "./dto/activate-plan.dto";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { StudentEntity } from "../../database/entities/student.entity";
import { MollieService } from "./mollie.service";
import { PaymentEntity } from "../../database/entities/payment.entity";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly mollieService: MollieService
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    return this.planRepository.save(createPlanDto);
  }

  async activate({ planId }: ActivatePlanDto, user: any) {
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    return this.mollieService.createPayment(plan, user.userId);
  }

  async activationStatus({ planId }: ActivatePlanDto, user: any) {
    const { status } = await this.paymentRepository.findOne({
      where: {
        user: { id: user.userId },
        plan: { id: planId },
      },
      order: { createAt: "DESC" },
    });
    return { status: status === "paid" ? "activated" : "unactivated" };
  }

  async getUserSuscirption(userId: string) {
    return this.subscriptionRepository.findOne({
      relationLoadStrategy: "join",
      relations: ["plan"],
      where: { user: { id: userId } },
      order: { createAt: "DESC" },
    });
  }

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const [data, total] = await this.planRepository.findAndCount({
      ...(query ? { where: { name: ILike(`%${query}%`) } } : {}),
      take: limit,
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

  stats() {
    return { total: 10, inProgress: 4, completed: 3 };
  }

  findOne(id: string) {
    return this.planRepository.findOne({
      where: { id },
      relations: ["course"],
      relationLoadStrategy: "join",
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.planRepository.findOneBy({ id });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  remove(id: string) {
    return this.planRepository.delete({ id });
  }
}
