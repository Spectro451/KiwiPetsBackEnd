import { Test, TestingModule } from '@nestjs/testing';
import { MascotaController } from './mascota.controller';

describe('MascotaController', () => {
  let controller: MascotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MascotaController],
    }).compile();

    controller = module.get<MascotaController>(MascotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
