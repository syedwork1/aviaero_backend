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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../database/entities/user.entity");
const exception_enum_1 = require("../enums/exception.enum");
const core_helper_1 = require("../../../core/helpers/core.helper");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        const savedUser = await this.userRepository.save({
            ...user,
            password: await (0, core_helper_1.hashPassword)(user.password),
        });
        return savedUser;
    }
    async deleteUser(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(exception_enum_1.ExceptionEnum.USER_NOT_FOUND);
        }
        await this.userRepository.delete(userId);
    }
    async findOne(where) {
        const user = await this.userRepository.findOne({
            where,
        });
        if (!user) {
            throw new common_1.NotFoundException(exception_enum_1.ExceptionEnum.USER_NOT_FOUND);
        }
        return user;
    }
    async findOneOptional(where) {
        const user = await this.userRepository.findOne({
            where,
        });
        return user;
    }
    async getAll(where = {}, select = ['id', 'email', 'firstName', 'lastName']) {
        const user = await this.userRepository.find({
            where: {
                ...where,
                role: 'STUDENT',
            },
            select: select,
        });
        if (!user) {
            throw new common_1.NotFoundException(exception_enum_1.ExceptionEnum.USER_NOT_FOUND);
        }
        return user;
    }
    async update(criteria, user) {
        return this.userRepository.update(criteria, user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map