import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const CATEGORIES = [
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
] as const;

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsEnum(CATEGORIES, { message: 'Categoría inválida' })
  category: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}

export class UpdateStockDto {
  @IsNumber()
  @Min(0)
  stock: number;
}
