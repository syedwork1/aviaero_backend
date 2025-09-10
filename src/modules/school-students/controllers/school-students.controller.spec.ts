import { Test, TestingModule } from '@nestjs/testing';
import { SchoolStudentsController } from './school-students.controller';
import { SchoolStudentsService } from '../school-students.service';

describe('SchoolStudentsController', () => {
  let controller: SchoolStudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolStudentsController],
      providers: [SchoolStudentsService],
    }).compile();

    controller = module.get<SchoolStudentsController>(SchoolStudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
