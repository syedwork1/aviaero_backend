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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("../../../database/entities/subject.entity");
let SubjectService = class SubjectService {
    constructor(SubjectEntityRepository) {
        this.SubjectEntityRepository = SubjectEntityRepository;
    }
    create(createSubjectDto) {
        return this.SubjectEntityRepository.save(createSubjectDto);
    }
    findAll() {
        return this.SubjectEntityRepository.find();
    }
    findOne(id) {
        return `This action returns a #${id} subject`;
    }
    update(id, updateSubjectDto) {
        return `This action updates a #${id} subject`;
    }
    remove(id) {
        return `This action removes a #${id} subject`;
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.SubjectEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map