import { Test, TestingModule } from '@nestjs/testing';
import { PostcommentService } from './postcomment.service';

describe('PostcommentService', () => {
  let service: PostcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostcommentService],
    }).compile();

    service = module.get<PostcommentService>(PostcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
