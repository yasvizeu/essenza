import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsEmail, IsStrongPassword, IsIdentityCard, IsDate, IsDateString, IsOptional, IsIn } from 'class-validator';
import { IsCpf } from '../../validators/is_cpf.decorator';
export class CreatePersonaDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    birthDate: string;

    @IsNotEmpty()
    @IsCpf({ message: 'O CPF precisa ser válido.' })
    cpf: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    cell: string;
    
    @IsString()
    @IsOptional()
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['cliente', 'profissional'], { message: 'Tipo deve ser cliente ou profissional' })
    type: 'cliente' | 'profissional';
}
