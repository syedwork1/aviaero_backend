import {
    Column,
    Entity,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceStatus } from "../../modules/cources/enums/status.enum";
import { CategoryEntity } from "./category.entity";
import { ExamEntity } from "./exam.entity";

@Entity()
export class CourceEntity extends AppBaseEntity {
    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: CourceStatus,
    })
    status: CourceStatus;

    @Column()
    description: string;

    @ManyToMany(() => CategoryEntity, (category) => category.cource, {})
    @JoinTable()
    category: CategoryEntity[];
}
