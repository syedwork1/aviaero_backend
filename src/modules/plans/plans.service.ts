import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PlanEntity } from "../../database/entities/plan.entity";
import { ILike, Repository } from "typeorm";
import { CourcesService } from "../cources/services/cources.service";
import { ActivatePlanDto } from "./dto/activate-plan.dto";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    private readonly coureService: CourcesService
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    return this.planRepository.save(createPlanDto);
  }

  async activate(activatePlanDto: ActivatePlanDto) {
    return { ...activatePlanDto, activated: true };
  }

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const [data, total] = await this.planRepository.findAndCount({
      ...(query ? { where: { name: ILike(`%${query}%`) } } : {}),
      take: limit,
      skip: page * limit || 0,
      ...(sortBy
        ? {
            order: {
              [sortBy]: "DESC",
            },
          }
        : {}),
    });

    return { data, total };
  }

  stats() {
    return { total: 10, inProgress: 4, completed: 3 };
  }

  findOne(id: string) {
    return this.planRepository.findOne({
      where: { id },
      relations: ["course"],
      relationLoadStrategy: "join",
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.planRepository.findOneBy({ id });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  remove(id: string) {
    return this.planRepository.delete({ id });
  }
}
