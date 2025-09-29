import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { S3Service } from "@core/providers/s3.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [S3Service],
})
export class UploadModule {}
