import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateProtocoloDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    servicos: Array<{ id: number; ordem: number; duracaoMin?: number; }>;
}
