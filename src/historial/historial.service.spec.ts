import { Test, TestingModule } from '@nestjs/testing';
import { HistorialClinicoService } from './historial.service';

describe('HistorialClinicoService', () => {
  let service: HistorialClinicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialClinicoService],
    }).compile();

    service = module.get<HistorialClinicoService>(HistorialClinicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
