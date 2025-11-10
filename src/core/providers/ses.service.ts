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

  async sendEmail(to: string, body: string) {
    const params = {
      Source: "info@aviaero.nl",
      Destination: {
        ToAddresses: ["olemeinders@gmail.com"],
      },
      Message: {
        Subject: {
          Data: "Test Email",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: "Hello, this is a test email",
            Charset: "UTF-8",
          },
        },
      },
    };
    await this.sesClient.send(new SendEmailCommand(params));
  }
}
