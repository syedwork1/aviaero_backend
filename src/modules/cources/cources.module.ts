import { Module } from "@nestjs/common";
import { CourcesService } from "./services/cources.service";
import { CourcesController } from "./controllers/cources.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourceEntity } from "../../database/entities/cource.entity";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from "../category/category.module";
import { CategoryEntity } from "../../database/entities/category.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CourceEntity, CategoryEntity]),
        ConfigModule,
        CategoryModule,
    ],
    controllers: [CourcesController],
    providers: [CourcesService],
    exports: [CourcesService],
})
export class CourcesModule {}
