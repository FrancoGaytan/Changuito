import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Family' })
  familyId?: Types.ObjectId;

  @Prop()
  resetCode?: string;

  @Prop()
  resetCodeExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
