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

// DTO principal para atualização genérica de Cliente
export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cell?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // type/cpf normalmente não deveriam ser alterados aqui, mas deixamos opcionais
  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  type?: 'cliente' | 'profissional';
}