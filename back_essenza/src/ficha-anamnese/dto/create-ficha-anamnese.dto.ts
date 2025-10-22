import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateFichaAnamneseDto {
    @IsNotEmpty()
    @IsString()
    healthProblems: string;
    
    @IsNotEmpty()
    @IsString()
    medications: string;

    @IsNotEmpty()
    @IsString()
    allergies: string;

    @IsNotEmpty()
    @IsString()
    surgeries: string;

    @IsNotEmpty()
    @IsString()
    lifestyle: string;

    @IsNumber()
    @IsNotEmpty()
    clienteId: number;

    @IsOptional()
    @IsDateString()
    createdAt?: Date;

    @IsOptional()
    @IsDateString()
    updatedAt?: Date;
}
