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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.transporter.verify((err, success) => {
            if (err) {
                console.error(' SMTP connection failed:', err.message);
            }
            else {
                console.log('SMTP server is ready to take messages');
            }
        });
    }
    async sendPasswordResetEmail(to, resetUrl) {
        try {
            console.log(" Preparing email to:", to);
            const mailOptions = {
                from: `<${process.env.SMTP_USER}>`,
                to,
                subject: 'Password Reset Request',
                html: `
          <p>Hello,</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn’t request this, you can ignore this email.</p>
        `,
            };
            const info = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error("   Message:", error.message);
            throw new common_1.InternalServerErrorException("Failed to send email: " + error.message);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map