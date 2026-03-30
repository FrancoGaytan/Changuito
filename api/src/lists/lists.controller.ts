import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateListDto,
  AddItemDto,
  UpdateItemDto,
  SyncListDto,
} from './dto/lists.dto';
import { UserDocument } from '../auth/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Get()
  getAll(@CurrentUser() user: UserDocument) {
    return this.listsService.getAll(user._id.toString());
  }

  @Get(':id')
  getById(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.listsService.getById(user._id.toString(), id);
  }

  @Post()
  create(@CurrentUser() user: UserDocument, @Body() dto: CreateListDto) {
    return this.listsService.create(user._id.toString(), dto.name, dto.theme);
  }

  @Delete(':id')
  delete(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.listsService.deleteList(user._id.toString(), id);
  }

  @Post(':id/close')
  closeList(@CurrentUser() user: UserDocument, @Param('id') listId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.listsService.closeList(user._id.toString(), listId);
  }

  @Get(':id/items')
  getItems(@CurrentUser() user: UserDocument, @Param('id') listId: string) {
    return this.listsService.getItems(user._id.toString(), listId);
  }

  @Post(':id/items')
  addItem(
    @CurrentUser() user: UserDocument,
    @Param('id') listId: string,
    @Body() dto: AddItemDto,
  ) {
    return this.listsService.addItem(
      user._id.toString(),
      listId,
      dto.productId,
      dto.quantity ?? 1,
    );
  }

  @Patch(':id/sync')
  syncItems(
    @CurrentUser() user: UserDocument,
    @Param('id') listId: string,
    @Body() dto: SyncListDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.listsService.syncItems(user._id.toString(), listId, dto.items);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @CurrentUser() user: UserDocument,
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.listsService.updateItem(
      user._id.toString(),
      listId,
      itemId,
      dto,
    );
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @CurrentUser() user: UserDocument,
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.listsService.removeItem(user._id.toString(), listId, itemId);
  }
}
