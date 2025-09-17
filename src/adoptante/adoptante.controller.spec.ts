import { Test, TestingModule } from '@nestjs/testing';
import { AdoptanteController } from './adoptante.controller';

describe('AdoptanteController', () => {
  let controller: AdoptanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptanteController],
    }).compile();

    controller = module.get<AdoptanteController>(AdoptanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
