import { Test, TestingModule } from '@nestjs/testing';
import { PostlikedService } from './postliked.service';

describe('PostlikedService', () => {
  let service: PostlikedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostlikedService],
    }).compile();

    service = module.get<PostlikedService>(PostlikedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
