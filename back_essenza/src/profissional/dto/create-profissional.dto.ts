import { CreatePersonaDto } from "src/personas/dto/create-persona.dto";
import { IsNotEmpty, IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateProfissionalDto extends CreatePersonaDto {
    @IsNotEmpty()
    @IsBoolean()
    admin: boolean;

    @IsNotEmpty()
    @IsString()
    especialidade: string;

    @IsNotEmpty()
    @IsNumber()
    cnec: number;
}
