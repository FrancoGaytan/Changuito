import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getProducts(userId: string, category?: string, search?: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId) return [];

    const filter: Record<string, any> = { familyId: user.familyId };
    if (category && category !== 'todos') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await this.productModel.find(filter).sort({ name: 1 });
    return products.map((p) => this.formatProduct(p));
  }

  async createProduct(
    userId: string,
    data: { name: string; category: string; unit?: string; stock?: number },
  ) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const product = await this.productModel.create({
      name: data.name,
      category: data.category,
      unit: data.unit ?? 'unidad',
      stock: data.stock ?? 0,
      familyId: user.familyId,
      createdBy: new Types.ObjectId(userId),
    });

    return this.formatProduct(product);
  }

  async updateStock(userId: string, productId: string, stock: number) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const product = await this.productModel.findOneAndUpdate(
      { _id: productId, familyId: user.familyId },
      { stock: Math.max(0, stock) },
      { new: true },
    );
    if (!product) throw new NotFoundException('Producto no encontrado');
    return this.formatProduct(product);
  }

  async deleteProduct(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const result = await this.productModel.findOneAndDelete({
      _id: productId,
      familyId: user.familyId,
    });
    if (!result) throw new NotFoundException('Producto no encontrado');
  }

  private formatProduct(product: ProductDocument) {
    return {
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      unit: product.unit,
      stock: product.stock,
    };
  }
}
