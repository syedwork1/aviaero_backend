import { Test, TestingModule } from '@nestjs/testing';
import { SchoolStudentsService } from './school-students.service';

describe('SchoolStudentsService', () => {
  let service: SchoolStudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolStudentsService],
    }).compile();

    service = module.get<SchoolStudentsService>(SchoolStudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
