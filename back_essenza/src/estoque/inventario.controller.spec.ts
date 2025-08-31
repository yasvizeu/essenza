import { Test, TestingModule } from '@nestjs/testing';
import { InventarioController } from './inventario.controller';

describe('InventarioController', () => {
  let controller: InventarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioController],
    }).compile();

    controller = module.get<InventarioController>(InventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
