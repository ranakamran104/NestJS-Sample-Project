import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostlikedDto } from './dto/create-postliked.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from 'src/schemas/blogpost.schema';
import { PostLiked, PostLikedDocument } from 'src/schemas/postliked.schema';

@Injectable()
export class PostlikedService {
  constructor(
    @InjectModel(PostLiked.name)
    private postLikedModel: Model<PostLikedDocument>,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) {}

  async create(createPostlikedDto: CreatePostlikedDto, userId: string) {
    const { post_id } = createPostlikedDto;

    const isLikedExist = await this.postLikedModel
      .findOne({ post: post_id })
      .exec();

    if (isLikedExist) {
      throw new NotFoundException('Post already liked');
    }

    const newLiked = new this.postLikedModel({
      post: post_id,
      user: userId,
    });
    await newLiked.save();

    const blogPost = await this.blogPostModel.findOneAndUpdate(
      { _id: post_id },
      { $push: { likeds: newLiked._id } },
      { new: true },
    );

    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    return newLiked;
  }

  async findAll() {
    return await this.postLikedModel.find().exec();
  }

  async findOne(id: string) {
    const comment = await this.postLikedModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return comment;
  }

  // async update(id: string, updatePostlikedDto: UpdatePostlikedDto) {
  //   const existingLiked = await this.postLikedModel
  //     .findByIdAndUpdate(id, updatePostlikedDto, { new: true })
  //     .exec();
  //   if (!existingLiked) {
  //     throw new NotFoundException(`Post Like with ID "${id}" not found`);
  //   }
  //   return existingLiked;
  // }

  async remove(id: string) {
    const liked = await this.postLikedModel.findByIdAndDelete(id).exec();
    if (!liked) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    await this.blogPostModel.findByIdAndUpdate(
      liked.post,
      { $pull: { likeds: id } },
      { new: true },
    );
    return liked;
  }
}
