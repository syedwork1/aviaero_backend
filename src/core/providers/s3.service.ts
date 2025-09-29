import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get("AWS_REGION", "us-east-1"),
      endpoint: this.configService.get("S3_ENDPOINT"), // LocalStack URL in dev
      forcePathStyle: true, // required for LocalStack
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID", "test"),
        secretAccessKey: this.configService.get(
          "AWS_SECRET_ACCESS_KEY",
          "test"
        ),
      },
    });
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer | Uint8Array | string
  ) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });
    return this.s3Client.send(command);
  }
}
