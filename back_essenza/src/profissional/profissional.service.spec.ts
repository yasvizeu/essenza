import { Test, TestingModule } from '@nestjs/testing';
import { ProfissionalService } from './profissional.service';

describe('ProfissionalService', () => {
  let service: ProfissionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfissionalService],
    }).compile();

    service = module.get<ProfissionalService>(ProfissionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
