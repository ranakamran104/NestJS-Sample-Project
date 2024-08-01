import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { BlogPost } from './blogpost.schema';

export type PostCommentDocument = PostComment & Document;

@Schema({ timestamps: true })
export class PostComment {
  @Prop({ type: Types.ObjectId, ref: 'BlogPost', required: true })
  post: BlogPost;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  content: string;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
