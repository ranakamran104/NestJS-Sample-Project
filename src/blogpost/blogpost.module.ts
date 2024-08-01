import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from 'src/schemas/blogpost.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { PostComment, PostCommentSchema } from 'src/schemas/postcomment.schema';
import { PostLiked, PostLikedSchema } from 'src/schemas/postliked.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: PostComment.name, schema: PostCommentSchema },
      { name: PostLiked.name, schema: PostLikedSchema },
    ]),
  ],
  controllers: [BlogpostController],
  providers: [BlogpostService, JwtAuthGuard, JwtService],
})
export class BlogpostModule {}
