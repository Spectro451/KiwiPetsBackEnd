import { Test, TestingModule } from '@nestjs/testing';
import { AdoptanteService } from './adoptante.service';

describe('AdoptanteService', () => {
  let service: AdoptanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdoptanteService],
    }).compile();

    service = module.get<AdoptanteService>(AdoptanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
