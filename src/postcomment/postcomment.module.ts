import { Module } from '@nestjs/common';
import { PostcommentService } from './postcomment.service';
import { PostcommentController } from './postcomment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { BlogPost, BlogPostSchema } from 'src/schemas/blogpost.schema';
import { PostComment, PostCommentSchema } from 'src/schemas/postcomment.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostComment.name, schema: PostCommentSchema },
      { name: BlogPost.name, schema: BlogPostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostcommentController],
  providers: [PostcommentService, JwtAuthGuard, JwtService],
})
export class PostcommentModule {}
