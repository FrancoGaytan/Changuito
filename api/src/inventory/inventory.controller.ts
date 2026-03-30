import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductDto, UpdateStockDto } from './dto/product.dto';
import { UserDocument } from '../auth/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  getProducts(
    @CurrentUser() user: UserDocument,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.getProducts(
      user._id.toString(),
      category,
      search,
    );
  }

  @Post()
  createProduct(
    @CurrentUser() user: UserDocument,
    @Body() dto: CreateProductDto,
  ) {
    return this.inventoryService.createProduct(user._id.toString(), dto);
  }

  @Patch(':id/stock')
  updateStock(
    @CurrentUser() user: UserDocument,
    @Param('id') productId: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.inventoryService.updateStock(
      user._id.toString(),
      productId,
      dto.stock,
    );
  }

  @Delete(':id')
  deleteProduct(
    @CurrentUser() user: UserDocument,
    @Param('id') productId: string,
  ) {
    return this.inventoryService.deleteProduct(user._id.toString(), productId);
  }
}
