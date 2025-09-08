import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateAgendamentoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  startDateTime: string;

  @IsNotEmpty()
  @IsDateString()
  endDateTime: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['confirmed', 'tentative', 'cancelled'])
  status?: 'confirmed' | 'tentative' | 'cancelled';

  @IsOptional()
  @IsEnum(['pendente', 'pago', 'cancelado'])
  statusPagamento?: 'pendente' | 'pago' | 'cancelado';

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsNotEmpty()
  @IsNumber()
  clienteId: number;

  @IsNotEmpty()
  @IsNumber()
  profissionalId: number;

  @IsNotEmpty()
  @IsNumber()
  servicoId: number;
}
