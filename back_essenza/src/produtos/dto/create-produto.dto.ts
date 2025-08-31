import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsEmail, IsStrongPassword, IsIdentityCard, IsDate, IsDateString, IsOptional } from 'class-validator';
export class CreateProdutoDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsBoolean()
    emEstoque: boolean;

    @IsNotEmpty()
    @IsNumber()
    quantidade: number;

    @IsOptional()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsString()
    categoria: string;

    @IsNotEmpty()
    @IsDateString()
    dataValidade: string;

    @IsOptional()
    @IsString()
    baseUnit: string;
}
