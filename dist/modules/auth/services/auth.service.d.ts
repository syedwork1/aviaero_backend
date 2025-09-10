import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../../database/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { MailService } from './mail.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly mailService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, mailService: MailService);
    validateUser(email: string, password: string): Promise<Partial<UserEntity>>;
    signup(signupDto: SignupDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    getAccessTokens(user: any): {
        accessToken: string;
    };
    refreshToken(oldRefreshToken: string): any;
    createDefaultUser(email: string | undefined): Promise<{
        email: string;
        password: string;
    }>;
    generatePasswordResetToken(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
