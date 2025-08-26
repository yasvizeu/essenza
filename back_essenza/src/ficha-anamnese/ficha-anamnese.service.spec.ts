import { Test, TestingModule } from '@nestjs/testing';
import { FichaAnamneseService } from './ficha-anamnese.service';

describe('FichaAnamneseService', () => {
  let service: FichaAnamneseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichaAnamneseService],
    }).compile();

    service = module.get<FichaAnamneseService>(FichaAnamneseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
