import { Test, TestingModule } from '@nestjs/testing';
import { PostcommentController } from './postcomment.controller';
import { PostcommentService } from './postcomment.service';

describe('PostcommentController', () => {
  let controller: PostcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostcommentController],
      providers: [PostcommentService],
    }).compile();

    controller = module.get<PostcommentController>(PostcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
