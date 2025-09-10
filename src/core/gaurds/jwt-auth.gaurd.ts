import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {ExceptionEnum} from "../../modules/auth/enums/exception.enum";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(ExceptionEnum.MISSING_AUTHENTICATION);
    }

    try {
      request.user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(ExceptionEnum.INVALID_OR_EXPIRED_AUTHENTICATION);
    }
  }
}
