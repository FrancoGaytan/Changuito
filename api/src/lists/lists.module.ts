import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import {
  ShoppingList,
  ShoppingListSchema,
} from './schemas/shopping-list.schema';
import { ListItem, ListItemSchema } from './schemas/list-item.schema';
import { AuthModule } from '../auth/auth.module';
import { FamilyModule } from '../family/family.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingList.name, schema: ShoppingListSchema },
      { name: ListItem.name, schema: ListItemSchema },
    ]),
    AuthModule,
    FamilyModule,
    InventoryModule,
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
