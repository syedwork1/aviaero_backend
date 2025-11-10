import { Injectable } from "@nestjs/common";
import { SESService } from "@core/providers/ses.service";
import { readFileSync } from "fs";
import { join } from "path";

interface ISendSubscriptionConfirmationEmail {
  name: string;
  plan: string;
  startDate: string;
  endDate: string;
  amount: string;
  transactionId: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly sesService: SESService) {}

  loadTemplate(templateName: string): string {
    const filePath = join(__dirname, `./templates/${templateName}.html`);
    return readFileSync(filePath, "utf8");
  }

  async sendSubscriptionConfirmationEmail(
    to: string,
    data: ISendSubscriptionConfirmationEmail
  ) {
    let emailTemplate = this.loadTemplate("subscription");
    const htmlBody = emailTemplate
      .replace("{{studentName}}", data.name)
      .replace("{{planName}}", data.plan)
      .replace("{{startDate}}", data.startDate)
      .replace("{{endDate}}", data.endDate)
      .replace("{{amount}}", `$${data.amount}`)
      .replace("{{transactionId}}", data.transactionId)
      .replace("{{companyName}}", "Aviaero")
      .replace("{{currentYear}}", new Date().getFullYear().toString());
    //   .replace("{{dashboardUrl}}", "https://yourapp.com/dashboard")
    //   .replace("{{unsubscribeUrl}}", "https://yourapp.com/unsubscribe")
    //   .replace("{{privacyUrl}}", "https://yourapp.com/privacy");

    await this.sesService.sendEmail(
      [to],
      "Your Subscription is Active Successfully",
      htmlBody
    );
  }
}
