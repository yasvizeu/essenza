import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsOptional()
  @IsEnum(['cliente', 'profissional'])
  userType?: 'cliente' | 'profissional';
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  nome: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(['cliente', 'profissional'])
  tipo: 'cliente' | 'profissional';

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}

export class JwtPayload {
  sub: number;
  email: string;
  tipo: 'cliente' | 'profissional';
}
