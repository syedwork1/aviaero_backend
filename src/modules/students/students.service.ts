import { Injectable } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { UserService } from "../user/services/user.service";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "@core/enums/role.enum";
import { StudentEntity } from "../../database/entities/student.entity";

@Injectable()
export class StudentsService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    let user: UserEntity, student: StudentEntity;
    try {
      const existed = await this.userRepository.findOneBy({
        email: createStudentDto.email,
      });
      if (existed) {
        return { error: "Email already linked to another account!" };
      }
      user = await this.userService.createUser(createStudentDto);
      student = this.studentRepository.create({
        ...createStudentDto,
        user: { id: user.id },
        school: { id: createStudentDto.schoolId },
        createAt: new Date(),
      });
      student = await this.studentRepository.save(student, { reload: true });
      return this.studentRepository.findOne({
        select: {
          school: {
            id: true,
            name: true,
          },
        },
        where: { id: student.id },
        relations: ["school"],
      });
    } catch (error) {
      if (user) {
        await user.remove();
      }
      if (student) {
        await student.remove();
      }
      throw new Error(error);
    }
  }

  findAll(page: number, limit: number, sortBy: string, query: string) {
    return this.userRepository.find({
      select: ["id", "createAt", "email", "firstName", "lastName", "role"],
      where: {
        role: Role.STUDENT,
        ...(query ? { firstName: ILike(`%${query}%`) } : {}),
      },
      take: limit,
      skip: page * limit || 0,
      ...(sortBy
        ? {
            order: {
              [sortBy]: "DESC",
            },
          }
        : {}),
    });
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      select: ["id", "createAt", "email", "firstName", "lastName", "role"],
      where: { id },
    });
  }

  stats() {
    return { total: 10, new: 1, active: 4 };
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.userService.update({ id }, updateStudentDto);
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
