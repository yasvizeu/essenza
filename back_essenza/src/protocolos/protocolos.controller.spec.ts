import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolosController } from './protocolos.controller';
import { ProtocolosService } from './protocolos.service';

describe('ProtocolosController', () => {
  let controller: ProtocolosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtocolosController],
      providers: [ProtocolosService],
    }).compile();

    controller = module.get<ProtocolosController>(ProtocolosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
