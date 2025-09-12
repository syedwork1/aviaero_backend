import {Controller, Post, Body, Get, Req, Query, Param, Delete, UseGuards} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { UserCreateDto } from '../dtos/userCreate.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import {JwtAuthGuard} from "@core/gaurds/jwt-auth.gaurd";

@Controller('user')
// @ApiBearerAuth('authorization')
@ApiTags('User')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: UserCreateDto): Promise<Partial<UserEntity>> {
    return this.userService.createUser({ ...userDto, email: userDto.email });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Get()
  async getUser() {
    return this.userService.getAll();
  }
}
