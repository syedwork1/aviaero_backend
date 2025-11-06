import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto, RefreshTokenDto } from "../dtos/login.dto";
import { SignupDto } from "../dtos/signup.dto";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import {
  ForgetPasswordDto,
  ResetPasswordDto,
} from "../dtos/forgetPassword.dto";
import { UpdateProfileDto } from "../dtos/update-profile.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "User signup",
    description: "Create a new user account",
  })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({
    status: 409,
    description: "User already exists or username taken",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "User login",
    description: "Authenticate user and get access tokens",
  })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Todo: Test endpoint to create quick user with given email if any
  @Get("createDefaultUser/:email?")
  async createDefaultUser(@Param("email") email?: string) {
    return this.authService.createDefaultUser(email);
  }

  @Post("refresh")
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("authorization")
  @Post("protected")
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("authorization")
  @Get("profile")
  profile(@Req() req) {
    return this.authService.profile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("authorization")
  @Post("profile")
  updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    return this.authService.updateProfile(req.user, body);
  }

  @Post("forgotPassword")
  async forgotPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.generatePasswordResetToken(body.email);
  }

  @Post("resetPassword")
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body.token, body.password);
    return { message: "Password has been reset" };
  }
}
