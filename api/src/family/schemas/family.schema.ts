import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class FamilyMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['admin', 'editor', 'reader'], default: 'editor' })
  role: string;

  @Prop({ default: () => new Date() })
  joinedAt: Date;

  @Prop({ default: 'active', enum: ['active', 'pending'] })
  status: string;
}

export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);

export type FamilyDocument = HydratedDocument<Family>;

@Schema({ timestamps: true })
export class Family {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  inviteCode: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [FamilyMemberSchema], default: [] })
  members: FamilyMember[];
}

export const FamilySchema = SchemaFactory.createForClass(Family);
