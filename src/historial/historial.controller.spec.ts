import { Test, TestingModule } from '@nestjs/testing';
import { HistorialClinicoController } from './historial.controller';

describe('HistorialClinicoController', () => {
  let controller: HistorialClinicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialClinicoController],
    }).compile();

    controller = module.get<HistorialClinicoController>(HistorialClinicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
