import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import createMollieClient from "@mollie/api-client";
import { PaymentEntity } from "../../database/entities/payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class MollieService {
  mollieClient: any;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) {
    this.mollieClient = createMollieClient({
      apiKey: "",
    });
  }
}
