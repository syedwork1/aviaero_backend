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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const questions_service_1 = require("../services/questions.service");
const create_question_dto_1 = require("../dto/create-question.dto");
const update_question_dto_1 = require("../dto/update-question.dto");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const jwt_auth_gaurd_1 = require("../../../core/gaurds/jwt-auth.gaurd");
const roles_decorator_1 = require("../../../core/gaurds/roles.decorator");
const roles_guard_1 = require("../../../core/gaurds/roles.guard");
const role_enum_1 = require("../../../core/enums/role.enum");
let QuestionsController = class QuestionsController {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    create(createQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }
    findAll(page = 1, limit = 10) {
        return this.questionsService.findAll(Number(page), Number(limit));
    }
    findOne(id) {
        return this.questionsService.findOne(id);
    }
    update(id, updateQuestionDto) {
        return this.questionsService.update(id, updateQuestionDto);
    }
    remove(id) {
        return this.questionsService.remove(id);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('/single'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.STUDENT, role_enum_1.Role.ADMIN),
    __param(0, (0, common_2.Query)('page')),
    __param(1, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)('/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Patch)('/update/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, common_1.UseGuards)(jwt_auth_gaurd_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)('/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "remove", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('Questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map