import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  id: number;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: function (v: string) {
        // Regular expression for validating email
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid email!`,
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  resetToken?: string;

  @Prop()
  resetTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
