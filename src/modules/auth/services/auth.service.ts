import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../../database/entities/user.entity";
import { LoginDto } from "../dtos/login.dto";
import { SignupDto } from "../dtos/signup.dto";
import { ExceptionEnum } from "../enums/exception.enum";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/services/user.service";
import { hashPassword } from "@core/helpers/core.helper";
import { MailService } from "./mail.service";
import { PlansService } from "../../plans/plans.service";
import { Role } from "@core/enums/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly planService: PlansService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Partial<UserEntity>> {
    const user: UserEntity = await this.userService.findOne({
      email: email.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(signupDto: SignupDto): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await this.userService.findOneOptional({
        email: signupDto.email.toLowerCase(),
      });
      if (existingUser) {
        throw new ConflictException(ExceptionEnum.USER_ALREADY_EXISTS);
      }

      // Check if username already exists
      // const existingUsername = await this.userService.findOneOptional({ username: signupDto.username });
      // if (existingUsername) {
      //   throw new ConflictException(ExceptionEnum.USERNAME_ALREADY_TAKEN);
      // }

      // Create new user
      const newUser = await this.userService.createUser({
        email: signupDto.email.toLowerCase(),
        password: signupDto.password,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        // username: signupDto.username,
        // phone:signupDto.phone,
        //role:"ADMIN"
      });

      // Generate tokens for the new user
      const userWithoutPassword = { ...newUser, password: undefined };
      return {
        message: "User created successfully",
        user: userWithoutPassword,
        ...this.getAccessTokens(userWithoutPassword),
      };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new BadRequestException("Failed to create user");
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      if (!user) {
        throw new UnauthorizedException(ExceptionEnum.INVALID_CREDENTIALS);
      }

      if (user.role === Role.STUDENT) {
        const subscription = await this.planService.getUserSuscirption(user.id);
        return { ...this.getAccessTokens(user), user, subscription };
      }

      return { ...this.getAccessTokens(user), user, subscription: null };
    } catch (e) {
      throw new BadRequestException(ExceptionEnum.INVALID_CREDENTIALS);
    }
  }

  getAccessTokens(user) {
    const payload = {
      name: user.firstName + user.lastName,
      email: user.email,
      userId: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_SECRET_EXPIRY") ?? "1h",
    });

    // const refreshToken = this.jwtService.sign(payload, {
    //   secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    //   expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET_EXPIRY') ?? '7d',
    // });

    return { accessToken };
  }

  refreshToken(oldRefreshToken: string): any {
    const payload = this.jwtService.verify(oldRefreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
    });

    const newPayload = { email: payload.email, sub: payload.sub };
    const accessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_SECRET_EXPIRY") ?? "1h",
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn:
        this.configService.get<string>("JWT_REFRESH_SECRET_EXPIRY") ?? "7d",
    });

    return { accessToken: accessToken, refreshToken: newRefreshToken };
  }

  // Todo: Test code to add new User
  async createDefaultUser(email: string | undefined) {
    if (!email) {
      const user = await this.userService.findOne({
        email: "haider@shiftgroup.ca",
      });

      if (user) {
        return;
      }
    }

    await this.userService.createUser({
      email: email ?? "example@mail.com",
      firstName: "Example",
      lastName: "Test",
      password: "Aa@123456",
    });

    return {
      email: email ?? "example@mail.com",
      password: "Aa@123456",
    };
  }

  async generatePasswordResetToken(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const user = await this.userService.findOne({
      email,
    });
    if (!user) {
      return; // Empty return to make response ambiguous for security reasons
    }

    const payload = { email: user.email, userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_SECRET_EXPIRY") ?? "1h",
    });

    let appUrl = this.configService.get<string>("APP_URL");
    appUrl = appUrl ? appUrl.replace(/\/$/, "") : "";
    const resetUrl = `${appUrl}/resetpassword?token=${token}`;
    console.log("resetURL");
    // Todo: Send Mail code here, when we configure email channel for SHIFT
    const sendEmail = await this.mailService.sendPasswordResetEmail(
      user.email,
      resetUrl
    );
    console.log(sendEmail, "sendEmail");
    return {
      success: true,
      message: "Password reset link has been sent to your email.",
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const { email, userId } = this.jwtService.verify(token, {
      secret: this.configService.get<string>("JWT_SECRET"),
    });
    const user = await this.userService.findOne({
      id: userId,
    });
    if (!user) {
      throw new Error("Invalid token");
    }

    user.password = await hashPassword(newPassword); // Hash the password before saving
    await this.userService.update(
      {
        id: userId,
      },
      user
    );
  }
}
