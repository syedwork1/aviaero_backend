import { Module } from "@nestjs/common";
import { CategoryService } from "./services/category.service";
import { CategoryController } from "./controllers/category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../../database/entities/category.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ConfigModule],

  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
