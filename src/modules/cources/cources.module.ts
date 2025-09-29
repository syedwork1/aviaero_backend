import { Module } from "@nestjs/common";
import { CourcesService } from "./services/cources.service";
import { CourcesController } from "./controllers/cources.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourceEntity } from "../../database/entities/cource.entity";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CourceEntity]),
    ConfigModule,
    CategoryModule,
  ],
  controllers: [CourcesController],
  providers: [CourcesService],
})
export class CourcesModule {}
