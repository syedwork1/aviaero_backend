import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
// import { ExamEntity } from "./exam.entity";
import { CategoryEntity } from "./category.entity";
import { QuizAnswerEntity } from "./quiz-answer.entity";
import { QuestionReportEntity } from "./question-report.entity";

@Entity()
export class QuestionsEntity extends AppBaseEntity {
    @Column()
    question: string;

    @Column()
    option_A: string;

    @Column()
    option_B: string;

    @Column()
    option_C: string;

    @Column()
    option_D: string;

    @Column()
    correct_answer: string;

    @Column()
    explanation: string;

    @Column({ nullable: true })
    subscription_level: string;

    @Column({ default: true })
    is_exam_question: boolean;

    @ManyToOne(() => CategoryEntity, (category) => category.questions)
    @JoinColumn()
    Mobility: CategoryEntity;

    @OneToMany(() => QuizAnswerEntity, (quizAnswer) => quizAnswer.question)
    @JoinColumn()
    quizAnswer: QuizAnswerEntity;

    @Column()
    difficulty: string;

    @Column({ nullable: true })
    CBR_chapter: string;

    @Column({ nullable: true })
    img_1: string;

    @Column({ nullable: true })
    img_2: string;

    @OneToMany(() => QuestionReportEntity, (report) => report.question)
    report: QuestionReportEntity[];
}
