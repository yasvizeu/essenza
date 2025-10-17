import { IsEmail, IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  email: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  senhaAtual: string;

  @IsString()
  @MinLength(6)
  novaSenha: string;
}

export class UpdateCelularDto {
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Celular deve estar no formato (11) 99999-9999'
  })
  cell: string;
}