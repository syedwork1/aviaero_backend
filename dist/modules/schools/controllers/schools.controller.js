"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const schools_service_1 = require("../services/schools.service");
const create_school_dto_1 = require("../dto/create-school.dto");
const update_school_dto_1 = require("../dto/update-school.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_gaurd_1 = require("../../../core/gaurds/jwt-auth.gaurd");
const roles_decorator_1 = require("../../../core/gaurds/roles.decorator");
const roles_guard_1 = require("../../../core/gaurds/roles.guard");
const role_enum_1 = require("../../../core/enums/role.enum");
let SchoolsController = class SchoolsController {
    constructor(schoolsService) {
        this.schoolsService = schoolsService;
    }
    create(createSchoolDto) {
        return this.schoolsService.create(createSchoolDto);
    }
    findAll(page = 1, limit = 10) {
        return this.schoolsService.findAll(Number(page), Number(limit));
    }
    findOne(id) {
        return this.schoolsService.findOne(id);
    }
    update(id, updateSchoolDto) {
        return this.schoolsService.update(id, updateSchoolDto);
    }
    remove(id) {
        return this.schoolsService.remove(id);
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_school_dto_1.CreateSchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_school_dto_1.UpdateSchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "remove", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, swagger_1.ApiTags)('School'),
    (0, common_1.Controller)('schools'),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map