import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsEmail, IsStrongPassword, IsIdentityCard, IsDate, IsDateString } from 'class-validator';
import { IsCpf } from 'src/validators/is_cpf.decorator';
export class CreatePersonaDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsDateString()
    birthDate: string;

    @IsNotEmpty()
    @IsCpf({ message: 'O CPF precisa ser válido.' })
    cpf: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    cell: string;
    
    @IsString()
    address: string;
    type: 'cliente'| 'profissional';
}
