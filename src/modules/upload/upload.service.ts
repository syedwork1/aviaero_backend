import { S3Service } from "@core/providers/s3.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const bucket = this.configService.get("S3_BUCKET_NAME");
      const key = `${Date.now()}_${file.originalname}`;

      const { publicUrl } = await this.s3Service.uploadFile(
        bucket,
        key,
        file.buffer
      );

      return {
        message: "File uploaded successfully",
        key,
        publicUrl,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
