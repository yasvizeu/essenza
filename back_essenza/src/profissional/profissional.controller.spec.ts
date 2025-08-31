import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalController } from './profissional.controller';
import { ProfissionalService } from './profissional.service';

describe('ProfissionalController', () => {
  let controller: ProfissionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfissionalController],
      providers: [ProfissionalService],
    }).compile();

    controller = module.get<ProfissionalController>(ProfissionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
