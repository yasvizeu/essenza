import { Test, TestingModule } from '@nestjs/testing';
import { InventarioService } from './inventario.service';

describe('InventarioService', () => {
  let service: InventarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioService],
    }).compile();

    service = module.get<InventarioService>(InventarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
