import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPost, BlogPostDocument } from 'src/schemas/blogpost.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) {}

  async create(createBlogpostDto: CreateBlogpostDto, userId: number) {
    const { title, content, categoryId } = createBlogpostDto;

    const doesPostExist = await this.blogPostModel.findOne({ title });
    if (doesPostExist) {
      throw new Error('Post already created');
    }

    const newPost = new this.blogPostModel({
      title,
      content,
      category_id: categoryId,
      user_id: userId,
    });

    await newPost.save();
    return newPost;
  }

  async findAll() {
    const posts = await this.blogPostModel
      .find()
      .populate('user_id', 'name')
      .populate('category_id', 'name')
      .populate('comments')
      .populate('likeds')
      .sort({ createdAt: 'asc' })
      .exec();
    return posts;
  }

  async findOne(id: string) {
    const post = await this.blogPostModel
      .findById(id)
      .populate('user_id', 'name')
      .populate('category_id', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' },
      })
      .populate({
        path: 'likeds',
        populate: { path: 'user', select: 'name' },
      })
      .exec();

    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  async update(id: string, updateBlogpostDto: UpdateBlogpostDto) {
    const existingBlogPost = await this.blogPostModel
      .findByIdAndUpdate(id, updateBlogpostDto, { new: true })
      .exec();
    if (!existingBlogPost) {
      throw new NotFoundException(`Blogspost with ID "${id}" not found`);
    }
    return existingBlogPost;
  }

  async remove(id: string) {
    const result = await this.blogPostModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Blogspost with ID "${id}" not found`);
    }
  }
}
