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
exports.SchoolStudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const school_student_entity_1 = require("../../../database/entities/school-student.entity");
const typeorm_2 = require("typeorm");
let SchoolStudentsService = class SchoolStudentsService {
    constructor(SchoolStudentRepository) {
        this.SchoolStudentRepository = SchoolStudentRepository;
    }
    async create(createSchoolStudentDto) {
        try {
            const { schoolId, studentIds, subjectId, categoryId, enrolmentDate } = createSchoolStudentDto;
            const records = studentIds.map(studentId => ({
                schoolId,
                studentId,
                subjectId,
                categoryId,
                enrolmentDate,
            }));
            const newSchoolStudent = this.SchoolStudentRepository.create(records);
            const savedSchoolStudent = await this.SchoolStudentRepository.save(newSchoolStudent);
            return {
                success: true,
                message: 'School student added successfully',
                data: savedSchoolStudent,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to add school student',
                error: error.message,
            };
        }
    }
    findAll() {
        return `This action returns all schoolStudents`;
    }
    findOne(id) {
        return `This action returns a #${id} schoolStudent`;
    }
    update(id, updateSchoolStudentDto) {
        return `This action updates a #${id} schoolStudent`;
    }
    remove(id) {
        return `This action removes a #${id} schoolStudent`;
    }
};
exports.SchoolStudentsService = SchoolStudentsService;
exports.SchoolStudentsService = SchoolStudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(school_student_entity_1.SchoolStudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SchoolStudentsService);
//# sourceMappingURL=school-students.service.js.map