import { Test, TestingModule } from '@nestjs/testing';
import { CourcesController } from './cources.controller';
import { CourcesService } from '../services/cources.service';

describe('CourcesController', () => {
  let controller: CourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourcesController],
      providers: [CourcesService],
    }).compile();

    controller = module.get<CourcesController>(CourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
