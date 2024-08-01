import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { BlogPost } from './blogpost.schema';

export type PostLikedDocument = PostLiked & Document;

@Schema({ timestamps: true })
export class PostLiked {
  @Prop({ type: Types.ObjectId, ref: 'BlogPost', required: true })
  post: BlogPost;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const PostLikedSchema = SchemaFactory.createForClass(PostLiked);
