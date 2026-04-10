import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    enum: [
      'lacteos',
      'almacen',
      'limpieza',
      'perfumeria',
      'verduleria',
      'carniceria',
      'panaderia',
      'frescos',
      'bebidas',
      'otros',
    ],
  })
  category: string;

  @Prop({ default: 'unidad' })
  unit: string;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Family', required: true })
  familyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
