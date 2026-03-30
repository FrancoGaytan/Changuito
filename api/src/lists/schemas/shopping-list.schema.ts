import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShoppingListDocument = HydratedDocument<ShoppingList>;

@Schema({ timestamps: true })
export class ShoppingList {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    default: 'default',
    enum: [
      'default',
      'supermercado',
      'verduleria',
      'carniceria',
      'limpieza',
      'farmacia',
      'dietetica',
      'asado',
    ],
  })
  theme: string;

  @Prop()
  icon?: string;

  @Prop({ type: Types.ObjectId, ref: 'Family', required: true })
  familyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ShoppingListSchema =
  SchemaFactory.createForClass(ShoppingList);
