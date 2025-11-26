import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsBooleanString,
    IsInt,
    IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

/* ------------------------------
   START / FINISH / SUBMIT QUIZ
-------------------------------- */

export class StartQuizDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    studentId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    questions: number;
}

export class FinishQuizDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    quizId: string;
}

export class SubmitQuizAnswerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    quizId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    questionId: string;

    @ApiProperty()
    @IsString()
    selectedAnswer: string;
}

/* ------------------------------
   RESULT PAGINATION + FILTER DTO
-------------------------------- */

export class ResultQueryDto {
    @ApiPropertyOptional({
        example: 0,
        description: "Page no",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number = 0;

    @ApiPropertyOptional({
        // example: 10,
        description: "Page_size",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number = 10;

    // @ApiPropertyOptional({
    //     example: "sort_by",
    //     description: "sort by order",
    // })
    // @IsOptional()
    // @IsString()
    // sort_by?: string = "sort_by";

//     @ApiPropertyOptional({
//         enum: ["true", "false"],
//         description: "result_type",
//     })
//     @IsOptional()
//     @IsBooleanString()
//     result_type?: boolean;
// }
    @ApiPropertyOptional({
        enum: ["true", "false"],
        description: "Quiz mode: true = exam, false = practice",
        example: "true",
    })
    @IsOptional()
    @IsBooleanString()
    result_type?: string;
}