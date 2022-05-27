import { Test, TestingModule } from '@nestjs/testing';
import { SignalSessionsController } from './signal-sessions.controller';

describe('SignalSessionsController', () => {
  let controller: SignalSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalSessionsController],
    }).compile();

    controller = module.get<SignalSessionsController>(SignalSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
