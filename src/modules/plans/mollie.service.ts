import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import createMollieClient from "@mollie/api-client";
import { PaymentEntity } from "../../database/entities/payment.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { PlanEntity } from "../../database/entities/plan.entity";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { EmailService } from "./email.service";

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
    userId: string
  ): Promise<{ checkout: string }> {
    const payment = await this.mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: plan?.price,
      },
      description: plan.name,
      redirectUrl: `${this.configService.get("APP_URL")}/de/subscription/processing?planId=${plan.id}&userId=${userId}`,
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
    });

    return { checkout: payment?._links?.checkout?.href };
  }

  async processWebhook(paymentId: string) {
    const molliePaymentData = await this.mollieClient.payments.get(paymentId);
    if (molliePaymentData?.status === "paid") {
      const payment = await this.paymentRepository.findOne({
        where: { paymentId },
        relationLoadStrategy: "join",
        relations: ["plan", "user"],
      });
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + 1);
      const subscription = this.subscriptionRepository.create({
        expireAt,
        plan: { id: payment.plan.id },
        user: { id: payment.user.id },
        payment: { id: payment.id },
      });
      await this.subscriptionRepository.save(subscription);
      await this.paymentRepository.update(
        { id: payment.id },
        {
          status: molliePaymentData?.status,
          subscription: { id: subscription.id },
        }
      );
      await this.emailService.sendSubscriptionConfirmationEmail(
        payment.user.email,
        {
          name: `${payment.user.firstName} ${payment.user.lastName}`,
          plan: payment.plan.name,
          startDate: subscription.createAt.toLocaleDateString(),
          endDate: subscription.expireAt.toLocaleDateString(),
          amount: subscription.plan.price,
          transactionId: payment.paymentId,
        }
      );
    }
  }
}
