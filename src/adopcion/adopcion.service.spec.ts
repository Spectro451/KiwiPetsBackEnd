import { Test, TestingModule } from '@nestjs/testing';
import { AdopcionService } from './adopcion.service';

describe('AdopcionService', () => {
  let service: AdopcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdopcionService],
    }).compile();

    service = module.get<AdopcionService>(AdopcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
