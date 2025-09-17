import { Test, TestingModule } from '@nestjs/testing';
import { VacunasController } from './vacunas.controller';

describe('VacunasController', () => {
  let controller: VacunasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacunasController],
    }).compile();

    controller = module.get<VacunasController>(VacunasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
