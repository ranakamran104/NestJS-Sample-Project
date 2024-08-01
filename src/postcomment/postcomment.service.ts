import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostcommentDto } from './dto/create-postcomment.dto';
import { UpdatePostcommentDto } from './dto/update-postcomment.dto';
import {
  PostComment,
  PostCommentDocument,
} from 'src/schemas/postcomment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPost, BlogPostDocument } from 'src/schemas/blogpost.schema';

@Injectable()
export class PostcommentService {
  constructor(
    @InjectModel(PostComment.name)
    private postCommentModel: Model<PostCommentDocument>,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) {}

  async create(userId: string, createPostcommentDto: CreatePostcommentDto) {
    const { content, post_id } = createPostcommentDto;

    const newComment = new this.postCommentModel({
      content,
      post: post_id,
      user: userId,
    });
    await newComment.save();

    const blogPost = await this.blogPostModel.findOneAndUpdate(
      { _id: post_id },
      { $push: { comments: newComment._id } },
      { new: true },
    );

    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    return newComment;
  }

  async findAll() {
    return await this.postCommentModel.find().exec();
  }

  async findOne(id: string) {
    const comment = await this.postCommentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return comment;
  }

  async update(id: string, updatePostcommentDto: UpdatePostcommentDto) {
    const existingCategory = await this.postCommentModel
      .findByIdAndUpdate(id, updatePostcommentDto, { new: true })
      .exec();
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return existingCategory;
  }

  async remove(id: string) {
    const comment = await this.postCommentModel.findByIdAndDelete(id).exec();
    if (!comment) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    await this.blogPostModel.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: id } },
      { new: true },
    );
    return comment;
  }
}
