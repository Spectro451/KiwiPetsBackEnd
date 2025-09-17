import { Test, TestingModule } from '@nestjs/testing';
import { AdopcionController } from './adopcion.controller';

describe('AdopcionController', () => {
  let controller: AdopcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdopcionController],
    }).compile();

    controller = module.get<AdopcionController>(AdopcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
