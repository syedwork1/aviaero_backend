import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { UserService } from "../user/services/user.service";
import { ILike, MoreThanOrEqual, Repository } from "typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "@core/enums/role.enum";
import { StudentEntity } from "../../database/entities/student.entity";
import { SchoolsService } from "../schools/services/schools.service";

@Injectable()
export class StudentsService {
  constructor(
    private readonly userService: UserService,
    private readonly schoolService: SchoolsService,
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
    return this.studentRepository.find({
      relations: ["school"],
      select: {
        school: {
          id: true,
          name: true,
        },
      },
      where: {
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
    return this.studentRepository.findOne({
      select: {
        school: { id: true, name: true },
      },
      relations: ["school"],
      where: { id },
    });
  }

  async stats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: await this.studentRepository.count(),
      new: await this.studentRepository.count({
        where: { createAt: MoreThanOrEqual(today) },
      }),
      active: 4,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { email, password, schoolId, ...updateData } = updateStudentDto;
    const student = await this.studentRepository.findOne({
      where: { id },
      relationLoadStrategy: "join",
      relations: ["school", "user"],
      select: {
        user: {
          id: true,
          email: true,
        },
      },
    });
    if (!student) {
      throw new NotFoundException("Student not found");
    }
    const { data: school } = await this.schoolService.findOne(schoolId);
    if (!school) {
      throw new NotFoundException("School not found");
    }
    Object.assign(student, { ...updateData, email });
    student.school = school;
    await student.save();
    if (password || email) {
      await this.userService.update(
        { id: student.user.id },
        { ...(password ? { password } : {}), ...(email ? { email } : {}) }
      );
    }
    delete student.user;
    return student;
  }

  async remove(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException("student not found");
    return student.remove();
  }
}
