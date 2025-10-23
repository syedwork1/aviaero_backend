import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { UserService } from "../user/services/user.service";
import { ILike, MoreThanOrEqual, Repository } from "typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentEntity } from "../../database/entities/student.entity";
import { SchoolsService } from "../schools/services/schools.service";
import { QuizEntity } from "../../database/entities/quiz.entity";

@Injectable()
export class StudentsService {
  constructor(
    private readonly userService: UserService,
    private readonly schoolService: SchoolsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>
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
      relations: ["school", "user"],
      select: {
        school: {
          id: true,
          name: true,
        },
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      ...(query ? { where: { user: { firstName: ILike(`%${query}%`) } } } : {}),
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
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
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

  async dashboard(user: any) {
    //total exam total quiz
    let totalExam = 0,
      totalQuizes = 0;
    const quizes = await this.quizRepository.find({
      where: { student: { id: user.userId } },
    });
    for (const quiz of quizes) {
      if (quiz.isPractice) {
        totalQuizes += 1;
      } else {
        totalExam += 1;
      }
    }

    return {
      totalExam,
      totalQuizes,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { email, password, schoolId, firstName, lastName } = updateStudentDto;
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
    if (schoolId) {
      const { data: school } = await this.schoolService.findOne(schoolId);
      if (!school) {
        throw new NotFoundException("School not found");
      }
      student.school = school;
      await student.save();
    }
    if (password || email || firstName || lastName) {
      await this.userService.update(
        { id: student.user.id },
        {
          ...(password ? { password } : {}),
          ...(email ? { email } : {}),
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
        }
      );
    }
    return student;
  }

  async remove(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException("student not found");
    Promise.all([
      student.remove(),
      this.userService.deleteUser(student.user.id),
    ]);
    return true;
  }
}
