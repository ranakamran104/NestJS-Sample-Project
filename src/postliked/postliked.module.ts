import { Module } from '@nestjs/common';
import { PostlikedService } from './postliked.service';
import { PostlikedController } from './postliked.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from 'src/schemas/blogpost.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PostLiked, PostLikedSchema } from 'src/schemas/postliked.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostLiked.name, schema: PostLikedSchema },
      { name: BlogPost.name, schema: BlogPostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostlikedController],
  providers: [PostlikedService, JwtAuthGuard, JwtService],
})
export class PostlikedModule {}
