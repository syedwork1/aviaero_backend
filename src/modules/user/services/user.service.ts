import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, FindOptionsSelect, Repository } from "typeorm";
import { UserEntity } from "../../../database/entities/user.entity";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { ExceptionEnum } from "../enums/exception.enum";
import { hashPassword } from "@core/helpers/core.helper";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const savedUser = await this.userRepository.save({
      ...user,
      password: await hashPassword(user.password),
    });
    return savedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(ExceptionEnum.USER_NOT_FOUND);
    }

    await this.userRepository.delete(userId);
  }

  async findOne(
    where: FindOptionsWhere<UserEntity>,
    relations?: FindOptionsRelations<UserEntity>
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relationLoadStrategy: "join",
      relations,
      where,
    });
    if (!user) {
      throw new NotFoundException(ExceptionEnum.USER_NOT_FOUND);
    }

    return user;
  }

  async findOneOptional(
    where: FindOptionsWhere<UserEntity>
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where,
    });
    return user;
  }

  async getAll(
    where: FindOptionsWhere<UserEntity> = {},
    select: Array<string> = ["id", "email", "firstName", "lastName"]
  ): Promise<UserEntity[]> {
    const user = await this.userRepository.find({
      where: {
        ...where,
        role: "STUDENT",
      },
      select: select as FindOptionsSelect<UserEntity>,
    });
    if (!user) {
      throw new NotFoundException(ExceptionEnum.USER_NOT_FOUND);
    }
    return user;
  }

  async update(
    criteria: FindOptionsWhere<UserEntity>,
    user: Partial<UserEntity>
  ): Promise<UpdateResult> {
    return this.userRepository.update(criteria, {
      ...user,
      ...("password" in user
        ? { password: await hashPassword(user.password) }
        : {}),
    });
  }
}
