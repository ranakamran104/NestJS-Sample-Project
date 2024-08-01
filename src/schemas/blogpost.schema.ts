import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Category } from './category.schema';
// import { PostComment } from './postcomment.schema';
// import { PostLiked } from './postliked.schema';

export type BlogPostDocument = BlogPost & Document;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Category;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  // @Prop([{ type: Types.ObjectId, ref: 'PostComment' }])
  // comments: PostComment[];

  @Prop([{ type: String, ref: 'PostComment' }])
  comments: string[];

  // @Prop([{ type: Types.ObjectId, ref: 'PostLiked' }])
  // likeds: PostLiked[];

  @Prop([{ type: String, ref: 'PostLiked' }])
  likeds: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
