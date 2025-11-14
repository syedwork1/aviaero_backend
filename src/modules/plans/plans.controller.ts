import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PlansService } from "./plans.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "@core/enums/role.enum";
import { Roles } from "@core/decorators/roles.decorator";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { ActivatePlanDto } from "./dto/activate-plan.dto";
import { MollieService } from "./mollie.service";
import { PlanSubjectTypeEnum } from "@core/enums/plan.enum";

@ApiTags("plans")
@Controller("plans")
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly mollieService: MollieService
  ) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post("activate")
  activate(@Body() activatePlanDto: ActivatePlanDto, @Req() req) {
    return this.plansService.activate(activatePlanDto, req.user);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post("activation-status")
  status(@Body() activationStatusDto: ActivatePlanDto, @Req() req) {
    return this.plansService.activationStatus(activationStatusDto, req.user);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  // @Roles(Role.STUDENT)
  @Get("payments")
  payments(@Req() req) {
    return this.plansService.payments(req.user);
  }

  @ApiExcludeEndpoint()
  @Post("webhook")
  webhook(@Body() { id }: any) {
    return this.mollieService.processWebhook(id);
  }

  @ApiQuery({
    name: "page",
    type: Number,
    description: "page no",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    description: "page size",
    required: false,
  })
  @ApiQuery({
    name: "sort_by",
    type: String,
    description: "sort by",
    required: false,
  })
  @ApiQuery({
    name: "yearly",
    type: Boolean,
    description: "filter by duration",
    required: false,
  })
  @ApiQuery({
    name: "subject_type",
    enum: PlanSubjectTypeEnum,
    description: "filter based on subject type",
    required: false,
  })
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by") sortBy: string,
    @Query("yearly", new DefaultValuePipe(false)) yearly: boolean,
    @Query("subject_type", new DefaultValuePipe(PlanSubjectTypeEnum.all))
    subjectType: PlanSubjectTypeEnum
  ) {
    return this.plansService.findAll(page, limit, sortBy, yearly, subjectType);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("stats")
  stats() {
    return this.plansService.stats();
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.plansService.findOne(id);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.plansService.remove(id);
  }
}
