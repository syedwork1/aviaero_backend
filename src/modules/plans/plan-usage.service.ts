import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanUsageEntity } from "../../database/entities/plan-usage.entity";

@Injectable()
export class PlansUsageService {
  constructor(
    @InjectRepository(PlanUsageEntity)
    private readonly planUsageRepository: Repository<PlanUsageEntity>
  ) {}

  async currentUsage(studentId: string, feature: string) {
    const usage = await this.planUsageRepository.findOne({
      where: { student: { id: studentId }, feature },
    });
    if (!usage) {
      return 0;
    }
    return usage.usage;
  }

  async increment(studentId: string, feature: string) {
    const usage = await this.planUsageRepository.findOne({
      where: { student: { id: studentId }, feature },
    });
    if (!usage) {
      await this.planUsageRepository.save({
        feature,
        student: { id: studentId },
        usage: 1,
      });
      return true;
    }
    usage.usage++;
    await usage.save();
    return true;
  }

  reset(studentId: string) {
    return this.planUsageRepository.update(
      { student: { id: studentId } },
      { usage: 0, resetAt: new Date() }
    );
  }
}
