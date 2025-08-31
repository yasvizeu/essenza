import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsEmail, IsStrongPassword, IsIdentityCard, IsDate, IsDateString } from 'class-validator';

export class CreateServicoDto {

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    preco: number;

    @IsNotEmpty()
    @IsBoolean()
    ativo: boolean;

    @IsNotEmpty()
    @IsDateString()
    dataInicio: string;

    @IsDateString()
    dataFim: string;

    
}
