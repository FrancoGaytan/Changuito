import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ShoppingList,
  ShoppingListDocument,
} from './schemas/shopping-list.schema';
import { ListItem, ListItemDocument } from './schemas/list-item.schema';
import { Product, ProductDocument } from '../inventory/schemas/product.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Family, FamilyDocument } from '../family/schemas/family.schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(ShoppingList.name)
    private listModel: Model<ShoppingListDocument>,
    @InjectModel(ListItem.name)
    private listItemModel: Model<ListItemDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Family.name)
    private familyModel: Model<FamilyDocument>,
  ) {}

  async getAll(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId) return [];

    const lists = await this.listModel
      .find({ familyId: user.familyId })
      .sort({ updatedAt: -1 });

    const family = await this.familyModel.findById(user.familyId);
    const memberIds = family?.members.map((m) => m.userId) ?? [];
    const members = await this.userModel
      .find({ _id: { $in: memberIds } })
      .select('name avatarUrl');

    return Promise.all(
      lists.map(async (list) => {
        const items = await this.listItemModel.find({ listId: list._id });
        return {
          id: list._id.toString(),
          name: list.name,
          theme: list.theme,
          icon: list.icon,
          productCount: items.length,
          completedCount: items.filter((i) => i.checked).length,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          updatedAt:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            (list as any).updatedAt?.toISOString() ?? new Date().toISOString(),
          members: members.map((m) => ({
            id: m._id.toString(),
            name: m.name,
            avatarUrl: m.avatarUrl,
          })),
        };
      }),
    );
  }

  async getById(userId: string, listId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const items = await this.listItemModel.find({ listId: list._id });
    const family = await this.familyModel.findById(user.familyId);
    const memberIds = family?.members.map((m) => m.userId) ?? [];
    const members = await this.userModel
      .find({ _id: { $in: memberIds } })
      .select('name avatarUrl');

    return {
      id: list._id.toString(),
      name: list.name,
      theme: list.theme,
      icon: list.icon,
      productCount: items.length,
      completedCount: items.filter((i) => i.checked).length,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updatedAt:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (list as any).updatedAt?.toISOString() ?? new Date().toISOString(),
      members: members.map((m) => ({
        id: m._id.toString(),
        name: m.name,
        avatarUrl: m.avatarUrl,
      })),
    };
  }

  async create(userId: string, name: string, theme?: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.create({
      name,
      theme: theme || 'default',
      familyId: user.familyId,
      createdBy: new Types.ObjectId(userId),
    });

    return {
      id: list._id.toString(),
      name: list.name,
      theme: list.theme,
      icon: list.icon,
      productCount: 0,
      completedCount: 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updatedAt:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (list as any).updatedAt?.toISOString() ?? new Date().toISOString(),
      members: [
        {
          id: userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      ],
    };
  }

  async deleteList(userId: string, listId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOneAndDelete({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    await this.listItemModel.deleteMany({ listId: list._id });
  }

  // ——— List Items ———

  async getItems(userId: string, listId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const items = await this.listItemModel.find({ listId: list._id });

    const productIds = items.map((i) => i.productId);
    const products = await this.productModel.find({
      _id: { $in: productIds },
    });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const userIds = [...new Set(items.map((i) => i.addedBy.toString()))];
    const users = await this.userModel
      .find({ _id: { $in: userIds } })
      .select('name');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return items.map((item) => {
      const product = productMap.get(item.productId.toString());
      const addedByUser = userMap.get(item.addedBy.toString());
      return {
        id: item._id.toString(),
        product: product
          ? {
              id: product._id.toString(),
              name: product.name,
              category: product.category,
              unit: product.unit,
              stock: product.stock,
            }
          : null,
        quantity: item.quantity,
        checked: item.checked,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        failed: item.failed,
        addedBy: {
          id: item.addedBy.toString(),
          name: addedByUser?.name ?? 'Desconocido',
        },
        note: item.note,
      };
    });
  }

  async addItem(
    userId: string,
    listId: string,
    productId: string,
    quantity: number,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const product = await this.productModel.findOne({
      _id: productId,
      familyId: user.familyId,
    });
    if (!product)
      throw new NotFoundException('Producto no encontrado en el inventario');

    // If product already in list, increment quantity
    const existing = await this.listItemModel.findOne({
      listId: list._id,
      productId: product._id,
    });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      // Touch list updatedAt
      await this.listModel.updateOne(
        { _id: list._id },
        { $set: { updatedAt: new Date() } },
      );
      return this.formatItem(existing, product, user);
    }

    const item = await this.listItemModel.create({
      listId: list._id,
      productId: product._id,
      quantity: quantity || 1,
      addedBy: new Types.ObjectId(userId),
    });

    await this.listModel.updateOne(
      { _id: list._id },
      { $set: { updatedAt: new Date() } },
    );

    return this.formatItem(item, product, user);
  }

  async updateItem(
    userId: string,
    listId: string,
    itemId: string,
    data: {
      quantity?: number;
      checked?: boolean;
      note?: string;
      failed?: boolean;
    },
  ) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const item = await this.listItemModel.findOneAndUpdate(
      { _id: itemId, listId: list._id },
      { $set: data },
      { new: true },
    );
    if (!item) throw new NotFoundException('Item no encontrado');

    const product = await this.productModel.findById(item.productId);
    return this.formatItem(item, product, user);
  }

  async syncItems(
    userId: string,
    listId: string,
    items: {
      productId: string;
      quantity: number;
      checked: boolean;
      failed?: boolean;
    }[],
  ) {
    const list = await this.getById(userId, listId);
    const listObjectId = new Types.ObjectId(list.id);

    // Get current items to preserve who added them initially if they still exist
    const currentItems = await this.listItemModel.find({
      listId: listObjectId,
    });
    const addedByMap = new Map();
    currentItems.forEach((item) => {
      addedByMap.set(item.productId.toString(), item.addedBy);
    });

    // Clear old items
    await this.listItemModel.deleteMany({ listId: listObjectId });

    if (items.length > 0) {
      const docsToInsert = items.map((item) => ({
        listId: listObjectId,
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
        checked: item.checked,
        failed: item.failed ?? false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        addedBy: addedByMap.get(item.productId) || new Types.ObjectId(userId),
      }));
      await this.listItemModel.insertMany(docsToInsert);
    }

    await this.listModel.updateOne(
      { _id: listObjectId },
      { $set: { updatedAt: new Date() } },
    );

    return this.getItems(userId, listId);
  }

  async removeItem(userId: string, listId: string, itemId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const result = await this.listItemModel.findOneAndDelete({
      _id: itemId,
      listId: list._id,
    });
    if (!result) throw new NotFoundException('Item no encontrado');
  }

  async closeList(userId: string, listId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new ForbiddenException('Necesitás pertenecer a un grupo familiar');

    const list = await this.listModel.findOne({
      _id: listId,
      familyId: user.familyId,
    });
    if (!list) throw new NotFoundException('Lista no encontrada');

    const listObjectId = new Types.ObjectId(listId);
    const items = await this.listItemModel.find({ listId: listObjectId });

    // For items that are NOT failed, increment product stock
    for (const item of items) {
      if (item.failed) continue;
      await this.productModel.updateOne(
        { _id: item.productId, familyId: user.familyId },
        { $inc: { stock: item.quantity } },
      );
      // no-op: update results intentionally not logged in production
    }

    // Remove all items from the list
    await this.listItemModel.deleteMany({ listId: listObjectId });

    await this.listModel.updateOne(
      { _id: listObjectId },
      { $set: { updatedAt: new Date() } },
    );
  }

  private formatItem(
    item: ListItemDocument,
    product: ProductDocument | null,
    user: UserDocument,
  ) {
    return {
      id: item._id.toString(),
      product: product
        ? {
            id: product._id.toString(),
            name: product.name,
            category: product.category,
            unit: product.unit,
            stock: product.stock,
          }
        : null,
      quantity: item.quantity,
      checked: item.checked,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      failed: item.failed,
      addedBy: { id: user._id.toString(), name: user.name },
      note: item.note,
    };
  }
}
