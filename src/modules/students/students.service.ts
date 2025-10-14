import { Injectable } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { UserService } from "../user/services/user.service";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "@core/enums/role.enum";
import { StudentSchoolEntity } from "../../database/entities/student-school.entity";

@Injectable()
export class StudentsService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StudentSchoolEntity)
    private readonly studentSchoolRepository: Repository<StudentSchoolEntity>
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      const existed = await this.userRepository.findOneBy({
        email: createStudentDto.email,
      });
      if (existed) {
        return { error: "Email already linked to another account!" };
        // throw new Error("Email already linked to another account!");
      }
      const student = await this.userService.createUser(createStudentDto);
      delete student.password;
      if (createStudentDto?.schoolId) {
        await this.studentSchoolRepository.save({
          schoolId: createStudentDto.schoolId,
          studentId: student.id,
        });
      }
      return student;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findAll(page: number, limit: number, sortBy: string, query: string) {
    const students = await this.userRepository.find({
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
    const studentIds = students.map((student) => student.id);
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
