import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ListItemDocument = HydratedDocument<ListItem>;

@Schema({ timestamps: true })
export class ListItem {
  @Prop({ type: Types.ObjectId, ref: 'ShoppingList', required: true, index: true })
  listId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ default: 1, min: 1 })
  quantity: number;

  @Prop({ default: false })
  checked: boolean;

  @Prop({ default: false })
  failed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  addedBy: Types.ObjectId;

  @Prop()
  note?: string;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);
