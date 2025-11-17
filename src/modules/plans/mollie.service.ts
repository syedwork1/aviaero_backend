import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import createMollieClient from "@mollie/api-client";
import { PaymentEntity } from "../../database/entities/payment.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { PlanEntity } from "../../database/entities/plan.entity";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { EmailService } from "./email.service";
import { PlanDurationEntity } from "../../database/entities/plan-duration.entity";
import { PlanTypeEnum } from "@core/enums/plan.enum";

@Injectable()
export class MollieService {
  private mollieClient: any;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {
    this.mollieClient = createMollieClient({
      apiKey: this.configService.get("MOLLIE_API_KEY"),
    });
  }

  async createPayment(
    plan: PlanEntity,
    duration: PlanDurationEntity,
    userId: string
  ): Promise<{ checkout: string }> {
    const payment = await this.mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: duration.price,
      },
      description: plan.name,
      redirectUrl: `${this.configService.get("APP_URL")}/de/subscription/processing?planId=${plan.id}&durationId=${duration.id}`,
      webhookUrl: `${this.configService.get("APP_URL")}/api/plans/webhook`,
      metadata: {
        planId: plan.id,
        userId,
      },
    });

    await this.paymentRepository.save({
      paymentId: payment.id,
      status: payment.status,
      user: { id: userId },
      plan: { id: plan.id },
      duration: { id: duration.id },
    });

    return { checkout: payment?._links?.checkout?.href };
  }

  async processWebhook(paymentId: string) {
    const molliePaymentData = await this.mollieClient.payments.get(paymentId);
    if (molliePaymentData?.status === "paid") {
      const payment = await this.paymentRepository.findOne({
        where: { paymentId },
        relationLoadStrategy: "join",
        relations: ["plan", "plan.subject", "user", "duration"],
      });
      const expireAt = new Date();
      expireAt.setMonth(
        expireAt.getMonth() + payment.duration.durationInMonths
      );
      const subscription = this.subscriptionRepository.create({
        expireAt,
        plan: { id: payment.plan.id },
        duration: { id: payment.duration.id },
        user: { id: payment.user.id },
        payment: { id: payment.id },
        ...(payment.plan.type === PlanTypeEnum.SUBJECT
          ? { subject: { id: payment.plan.subject.id } }
          : {}),
      });
      await this.subscriptionRepository.save(subscription);
      await this.paymentRepository.update(
        { id: payment.id },
        {
          status: molliePaymentData?.status,
        }
      );
      // await this.emailService.sendSubscriptionConfirmationEmail(
      //   payment.user.email,
      //   {
      //     name: `${payment.user.firstName} ${payment.user.lastName}`,
      //     plan: payment.plan.name,
      //     startDate: subscription.createAt.toLocaleDateString(),
      //     endDate: subscription.expireAt.toLocaleDateString(),
      //     amount: subscription.duration.price,
      //     transactionId: payment.paymentId,
      //   }
      // );
    }
  }
}
