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
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const school_entity_1 = require("../../../database/entities/school.entity");
let SchoolsService = class SchoolsService {
    constructor(schoolRepository) {
        this.schoolRepository = schoolRepository;
    }
    async create(createSchoolDto) {
        try {
            const school = this.schoolRepository.create(createSchoolDto);
            const savedSchool = await this.schoolRepository.save(school);
            return {
                success: true,
                message: 'School created successfully',
                data: savedSchool,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                success: false,
                message: error.message || 'Failed to create school',
            });
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.schoolRepository.find({
                    skip,
                    take: limit,
                }),
                this.schoolRepository.count(),
            ]);
            return {
                success: true,
                message: 'Questions fetched successfully',
                data,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch questions ',
            };
        }
    }
    async findOne(id) {
        try {
            const findSingleSchool = await this.schoolRepository.findOne({
                where: { id },
            });
            if (!findSingleSchool) {
                return {
                    success: false,
                    message: `School with id ${id} not found`,
                };
            }
            return {
                success: true,
                message: "Single school fetched successfully",
                data: findSingleSchool,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "Failed to fetch school",
            };
        }
    }
    async update(id, updateSchoolDto) {
        const findSchool = await this.schoolRepository.findOne({ where: { id } });
        if (!findSchool) {
            return {
                success: false,
                message: "School not found"
            };
        }
        await this.schoolRepository.update(id, updateSchoolDto);
        const updatedSchool = await this.schoolRepository.findOne({ where: { id } });
        return {
            success: true,
            message: "Successfully updated the School",
            data: updatedSchool,
        };
    }
    async remove(id) {
        const result = await this.schoolRepository.delete(id);
        if (result.affected === 0) {
            return {
                success: false,
                message: "School not found",
            };
        }
        return {
            success: true,
            message: "School deleted successfully",
        };
    }
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(school_entity_1.SchoolEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map