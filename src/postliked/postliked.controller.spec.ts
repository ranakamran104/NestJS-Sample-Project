import { Test, TestingModule } from '@nestjs/testing';
import { PostlikedController } from './postliked.controller';
import { PostlikedService } from './postliked.service';

describe('PostlikedController', () => {
  let controller: PostlikedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostlikedController],
      providers: [PostlikedService],
    }).compile();

    controller = module.get<PostlikedController>(PostlikedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
