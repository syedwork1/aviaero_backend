import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";

@ApiTags("attachments")
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiOperation({ summary: "Upload a single file" })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
