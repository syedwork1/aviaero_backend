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
exports.SchoolStudentsController = void 0;
const common_1 = require("@nestjs/common");
const school_students_service_1 = require("../services/school-students.service");
const create_school_student_dto_1 = require("../dto/create-school-student.dto");
const update_school_student_dto_1 = require("../dto/update-school-student.dto");
const swagger_1 = require("@nestjs/swagger");
let SchoolStudentsController = class SchoolStudentsController {
    constructor(schoolStudentsService) {
        this.schoolStudentsService = schoolStudentsService;
    }
    create(createSchoolStudentDto) {
        return this.schoolStudentsService.create(createSchoolStudentDto);
    }
    findAll() {
        return this.schoolStudentsService.findAll();
    }
    findOne(id) {
        return this.schoolStudentsService.findOne(+id);
    }
    update(id, updateSchoolStudentDto) {
        return this.schoolStudentsService.update(+id, updateSchoolStudentDto);
    }
    remove(id) {
        return this.schoolStudentsService.remove(+id);
    }
};
exports.SchoolStudentsController = SchoolStudentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_school_student_dto_1.CreateSchoolStudentDto]),
    __metadata("design:returntype", void 0)
], SchoolStudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolStudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolStudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_school_student_dto_1.UpdateSchoolStudentDto]),
    __metadata("design:returntype", void 0)
], SchoolStudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolStudentsController.prototype, "remove", null);
exports.SchoolStudentsController = SchoolStudentsController = __decorate([
    (0, swagger_1.ApiTags)('School-students'),
    (0, common_1.Controller)('school-students'),
    __metadata("design:paramtypes", [school_students_service_1.SchoolStudentsService])
], SchoolStudentsController);
//# sourceMappingURL=school-students.controller.js.map