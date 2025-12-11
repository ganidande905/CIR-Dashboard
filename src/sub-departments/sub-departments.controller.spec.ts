import { Test, TestingModule } from '@nestjs/testing';
import { SubDepartmentsController } from './sub-departments.controller';
import { SubDepartmentsService } from './sub-departments.service';

describe('SubDepartmentsController', () => {
  let controller: SubDepartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubDepartmentsController],
      providers: [SubDepartmentsService],
    }).compile();

    controller = module.get<SubDepartmentsController>(SubDepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
