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
import { PlanTypeEnum } from "@core/enums/plan.enum";
import { PlanDurationEntity } from "../../database/entities/plan-duration.entity";

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

    @InjectRepository(PlanDurationEntity)
    private readonly planDurationRepository: Repository<PlanDurationEntity>,

    private readonly mollieService: MollieService
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const { features, durations, type, subjectId, ...planData } = createPlanDto;
    const planEntity = this.planRepository.create({
      ...planData,
      type,
      ...(type === PlanTypeEnum.SUBJECT && subjectId
        ? { subject: { id: subjectId } }
        : {}),
    });
    const plan = await this.planRepository.save(planEntity);
    const planDurations = this.planDurationRepository.create(
      durations.map(({ durationInMonths, price }) => ({
        durationInMonths,
        price,
        plan,
      }))
    );
    await this.planDurationRepository.save(planDurations);
    if (type === PlanTypeEnum.FEATURE) {
      const planFeatures = this.planFeatureRepository.create(
        features.map(({ description, limit, name, limited }) => ({
          limit,
          limited,
          description,
          name,
          plan,
        }))
      );
      await this.planFeatureRepository.save(planFeatures);
    }
    return this.planRepository.findOne({
      where: { id: plan.id },
      relationLoadStrategy: "join",
      relations: ["subject", "durations", "features"],
    });
  }

  async activate({ planId, durationId }: ActivatePlanDto, user: any) {
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    const duration = await this.planDurationRepository.findOne({
      where: { plan: { id: planId }, id: durationId },
    });
    return this.mollieService.createPayment(plan, duration, user.userId);
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

  async payments(user: any) {
    return this.paymentRepository.find({
      where: {
        user: { id: user.userId },
        status: "paid",
      },
      relationLoadStrategy: "join",
      relations: ["subscription"],
      order: { createAt: "ASC" },
    });
  }

  async getUserSubscription(userId: string) {
    return this.subscriptionRepository.findOne({
      relationLoadStrategy: "join",
      relations: [
        "plan",
        "plan.features",
        "plan.subject",
        "payment",
        "duration",
      ],
      where: { user: { id: userId } },
      order: { createAt: "DESC" },
    });
  }

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const [data, total] = await this.planRepository.findAndCount({
      relationLoadStrategy: "join",
      relations: ["features", "durations", "subject"],
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

    return {
      data: data.map((plan) => {
        if (plan && plan.type === PlanTypeEnum.SUBJECT) {
          const { name, limit } = plan.features[0];
          delete plan.features;
          return { subjectId: name, ...plan };
        }
        return plan;
      }),
      total,
    };
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

  async findOne(id: string) {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ["features"],
      relationLoadStrategy: "join",
    });

    if (plan && plan.type === PlanTypeEnum.SUBJECT) {
      const { name, limit } = plan.features[0];
      delete plan.features;
      return { subjectId: name, ...plan };
    }

    return plan;
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
    await this.planDurationRepository.delete({ plan: { id } });
    await this.planRepository.delete({ id });
    return "Plan deleted successfully";
  }
}
