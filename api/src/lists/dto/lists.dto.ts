import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la lista es obligatorio' })
  name: string;

  @IsEnum([
    'default',
    'supermercado',
    'verduleria',
    'carniceria',
    'limpieza',
    'farmacia',
    'dietetica',
    'asado',
  ])
  @IsOptional()
  theme?: string;
}

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}

export class UpdateItemDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsOptional()
  checked?: boolean;

  @IsOptional()
  failed?: boolean;

  @IsString()
  @IsOptional()
  note?: string;
}

import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsBoolean } from 'class-validator';

export class SyncItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsBoolean()
  checked: boolean;
  
  @IsOptional()
  failed?: boolean;
}

export class SyncListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncItemDto)
  items: SyncItemDto[];
}
