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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const exception_enum_1 = require("../enums/exception.enum");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../user/services/user.service");
const core_helper_1 = require("../../../core/helpers/core.helper");
const mail_service_1 = require("./mail.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService, mailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findOne({ email: email.toLowerCase() });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async signup(signupDto) {
        try {
            const existingUser = await this.userService.findOneOptional({ email: signupDto.email.toLowerCase() });
            if (existingUser) {
                throw new common_1.ConflictException(exception_enum_1.ExceptionEnum.USER_ALREADY_EXISTS);
            }
            const newUser = await this.userService.createUser({
                email: signupDto.email.toLowerCase(),
                password: signupDto.password,
                firstName: signupDto.firstName,
                lastName: signupDto.lastName,
            });
            const userWithoutPassword = { ...newUser, password: undefined };
            return {
                message: 'User created successfully',
                user: userWithoutPassword,
                ...this.getAccessTokens(userWithoutPassword)
            };
        }
        catch (e) {
            if (e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.BadRequestException('Failed to create user');
        }
    }
    async login(loginDto) {
        try {
            const user = await this.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new common_1.UnauthorizedException(exception_enum_1.ExceptionEnum.INVALID_CREDENTIALS);
            }
            return { ...this.getAccessTokens(user) };
        }
        catch (e) {
            throw new common_1.BadRequestException(exception_enum_1.ExceptionEnum.INVALID_CREDENTIALS);
        }
    }
    getAccessTokens(user) {
        const payload = { email: user.email, user_id: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_SECRET_EXPIRY') ?? '1h',
        });
        return { accessToken };
    }
    refreshToken(oldRefreshToken) {
        const payload = this.jwtService.verify(oldRefreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const newPayload = { email: payload.email, sub: payload.sub };
        const accessToken = this.jwtService.sign(newPayload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_SECRET_EXPIRY') ?? '1h',
        });
        const newRefreshToken = this.jwtService.sign(newPayload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRY') ?? '7d',
        });
        return { accessToken: accessToken, refreshToken: newRefreshToken };
    }
    async createDefaultUser(email) {
        if (!email) {
            const user = await this.userService.findOne({
                email: 'haider@shiftgroup.ca',
            });
            if (user) {
                return;
            }
        }
        await this.userService.createUser({
            email: email ?? 'haider@shiftgroup.ca',
            firstName: 'Test',
            lastName: 'Shift',
            password: 'Aa@123456',
        });
        return {
            email: email ?? 'haider@shiftgroup.ca',
            password: 'Aa@123456',
        };
    }
    async generatePasswordResetToken(email) {
        const user = await this.userService.findOne({
            email,
        });
        if (!user) {
            return;
        }
        const payload = { email: user.email, user_id: user.id };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_SECRET_EXPIRY') ?? '1h',
        });
        let appUrl = this.configService.get('APP_URL');
        appUrl = appUrl ? appUrl.replace(/\/$/, '') : '';
        const resetUrl = `${appUrl}/resetpassword?token=${token}`;
        console.log("resetURL");
        const sendEmail = await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
        console.log(sendEmail, "sendEmail");
        return {
            success: true,
            message: 'Password reset link has been sent to your email.',
        };
    }
    async resetPassword(token, newPassword) {
        const { email, user_id } = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
        const user = await this.userService.findOne({
            id: user_id,
        });
        if (!user) {
            throw new Error('Invalid token');
        }
        user.password = await (0, core_helper_1.hashPassword)(newPassword);
        await this.userService.update({
            id: user_id,
        }, user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map