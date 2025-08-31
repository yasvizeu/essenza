import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolosService } from './protocolos.service';

describe('ProtocolosService', () => {
  let service: ProtocolosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolosService],
    }).compile();

    service = module.get<ProtocolosService>(ProtocolosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
