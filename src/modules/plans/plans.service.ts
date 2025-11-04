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
import { PlanFeatureEntity } from "../../database/entities/plan-feature.entity";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(PlanFeatureEntity)
    private readonly planFeatureRepository: Repository<PlanFeatureEntity>,

    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly mollieService: MollieService
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const { features, ...planData } = createPlanDto;
    const plan = await this.planRepository.save(planData);
    await this.planFeatureRepository.insert(
      features.map((feature) => ({ ...feature, plan }))
    );
    return { message: "Plan created", success: true };
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

  async getUserSubscirption(userId: string) {
    return this.subscriptionRepository.findOne({
      relationLoadStrategy: "join",
      relations: ["plan", "plan.features"],
      where: { user: { id: userId } },
      order: { createAt: "DESC" },
    });
  }

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const [data, total] = await this.planRepository.findAndCount({
      relationLoadStrategy: "join",
      relations: ["features"],
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

  async stats() {
    const total = await this.planRepository.find({ select: { status: true } });
    const [active, inactive] = total.reduce(
      (stats, plan) => {
        const [active, inactive] = stats;
        if (plan.status === "ACTIVE") {
          return [active + 1, inactive];
        }
        return [active, inactive + 1];
      },
      [0, 0]
    );

    return {
      total: total.length,
      inactive,
      active,
    };
  }

  findOne(id: string) {
    return this.planRepository.findOne({
      where: { id },
      relations: ["features"],
      relationLoadStrategy: "join",
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const { features, ...planData } = updatePlanDto;

    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ["features"],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    Object.assign(plan, planData);
    await this.planRepository.save(plan);

    if (features && features.length > 0) {
      await this.planFeatureRepository.delete({ plan });
      const featureEntities = features.map((f) =>
        this.planFeatureRepository.create({ ...f, plan })
      );

      await this.planFeatureRepository.save(featureEntities);
    }

    return this.planRepository.findOne({
      where: { id },
      relations: ["features"],
    });
  }

  async remove(id: string) {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    await this.planFeatureRepository.delete({ plan: { id } });
    return this.planRepository.delete({ id });
  }
}
