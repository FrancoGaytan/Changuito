import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del grupo es obligatorio' })
  name: string;
}

export class JoinFamilyDto {
  @IsString()
  @IsNotEmpty({ message: 'El código de invitación es obligatorio' })
  code: string;
}
