import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { S3Service } from "@core/providers/s3.service";
import { ConfigModule } from "@nestjs/config";
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [S3Service, UploadService],
})
export class UploadModule {}
