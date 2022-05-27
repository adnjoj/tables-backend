import { Test, TestingModule } from '@nestjs/testing';
import { SignalSessionsService } from './signal-sessions.service';

describe('SignalSessionsService', () => {
  let service: SignalSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalSessionsService],
    }).compile();

    service = module.get<SignalSessionsService>(SignalSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
