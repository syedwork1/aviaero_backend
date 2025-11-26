import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceEntity } from "../entities/cource.entity";
import { QuestionsEntity } from "./question.entity";
import { QuizEntity } from "./quiz.entity";

@Entity()
export class CategoryEntity extends AppBaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    CBR_chapter: string;

    @ManyToMany(() => CourceEntity, (cource) => cource.category, {})
    @JoinColumn()
    cource: CourceEntity[];

    @OneToMany(() => QuestionsEntity, (question) => question.Mobility, {})
    questions: QuestionsEntity;

    @OneToOne(() => QuizEntity, (question) => question.category, {})
    quiz: QuizEntity;
}
