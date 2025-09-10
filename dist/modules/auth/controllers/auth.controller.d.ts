import { AuthService } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { ForgetPasswordDto, ResetPasswordDto } from '../dtos/forgetPassword.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    createDefaultUser(email?: string): Promise<{
        email: string;
        password: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<any>;
    getProfile(req: any): any;
    forgotPassword(body: ForgetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
