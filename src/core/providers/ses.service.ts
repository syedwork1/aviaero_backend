import { Injectable } from "@nestjs/common";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SESService {
  private sesClient;
  constructor(private readonly configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get("AWS_REGION", "us-east-1"),
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  async sendEmail(to: string[], subject: string, body: any) {
    const params = {
      Source: "info@aviaero.nl",
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: { Html: { Data: body } },
      },
    };
    await this.sesClient.send(new SendEmailCommand(params));
  }
}
