import { Test, TestingModule } from '@nestjs/testing';
import { FichaAnamneseController } from './ficha-anamnese.controller';
import { FichaAnamneseService } from './ficha-anamnese.service';

describe('FichaAnamneseController', () => {
  let controller: FichaAnamneseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichaAnamneseController],
      providers: [FichaAnamneseService],
    }).compile();

    controller = module.get<FichaAnamneseController>(FichaAnamneseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
