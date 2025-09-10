import { IsNotEmpty, IsNumber, IsBoolean, IsString, IsDateString, IsEnum, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateServicoDto {

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0.01)
    preco: number;

    @IsNotEmpty()
    @IsBoolean()
    disponivel: boolean;

    @IsNotEmpty()
    @IsEnum(['facial', 'corporal', 'massagem'])
    categoria: string;

    @IsOptional()
    @IsDateString()
    dataInicio?: string;

    @IsOptional()
    @IsDateString()
    dataFim?: string;

    @IsOptional()
    @IsNumber()
    duracao?: number;



    
}
