import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
  @ApiProperty({ description: "The question text" })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ description: "Option A" })
  @IsString()
  @IsNotEmpty()
  option_A: string;

  @ApiProperty({ description: "Option B" })
  @IsString()
  @IsNotEmpty()
  option_B: string;

  @ApiProperty({ description: "Option C" })
  @IsString()
  @IsNotEmpty()
  option_C: string;

  @ApiProperty({ description: "Option D" })
  @IsString()
  @IsNotEmpty()
  option_D: string;

  @ApiProperty({ description: "Correct answer for the question" })
  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @ApiProperty({ description: "Explanation for the answer" })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  // @ApiProperty({ description: 'Subscription level required' })
  // @IsString()

  // subscription_level: string;

  // @ApiProperty({ description: 'Whether it is an exam question', example: false })
  // @IsBoolean()
  // is_exam_question: boolean;

  @ApiProperty({ description: "Difficulty level" })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ description: "category" })
  @IsString()
  @IsNotEmpty()
  Mobility: string;

  // @ApiProperty({ description: 'CBR chapter reference' })
  // @IsString()
  // @IsNotEmpty()
  // CBR_chapter: string;
}
