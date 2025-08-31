import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateMovementDto {
  @IsInt() @IsPositive()
  produtoId: number;

  // pode ser negativo (saída) ou positivo (entrada)
  @IsNumber({ maxDecimalPlaces: 3 })
  quantidade: number;

  @IsString() @MaxLength(30)
  motivo: 'compra'|'execucao_servico'|'ajuste'|'transferencia_entrada'|'transferencia_saida';

  @IsString() @MaxLength(40) @IsOptional()
  refTipo?: string;

  @IsString() @MaxLength(64) @IsOptional()
  refId?: string;
}
