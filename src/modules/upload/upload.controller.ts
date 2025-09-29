import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "../../core/providers/s3.service";
import { ConfigService } from "@nestjs/config";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucket = this.configService.get("S3_BUCKET_NAME", "my-bucket");
    const key = file.originalname;

    await this.s3Service.uploadFile(bucket, key, file.buffer);

    return {
      message: "File uploaded successfully",
      key,
    };
  }
}
