import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PlanEntity } from "../../database/entities/plan.entity";
import { Repository } from "typeorm";
import { CourcesService } from "../cources/services/cources.service";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    private readonly coureService: CourcesService
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const course = await this.coureService.findOne(createPlanDto.courseId);
    if (!course) {
      throw new NotFoundException(
        `Course with id ${createPlanDto.courseId} not found`
      );
    }

    return this.planRepository.save({ ...createPlanDto, course });
  }

  findAll() {
    return this.planRepository.find();
  }

  findOne(id: string) {
    return this.planRepository.findOne({
      where: { id },
      relations: ["course"],
      relationLoadStrategy: "join",
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    let course: any, plan: PlanEntity;
    if ("courseId" in updatePlanDto) {
      course = await this.coureService.findOne(updatePlanDto.courseId);
      if (!course) {
        throw new NotFoundException(
          `Course with id ${updatePlanDto.courseId} not found`
        );
      }
    }

    plan = await this.planRepository.findOneBy({ id });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }

    Object.assign(plan, updatePlanDto);
    return this.planRepository.save({ ...plan, ...(course ? { course } : {}) });
  }

  remove(id: string) {
    return this.planRepository.delete({ id });
  }
}
