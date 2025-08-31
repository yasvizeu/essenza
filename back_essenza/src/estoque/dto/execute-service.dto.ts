import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class ExecuteServiceDto {
  @IsInt() @IsPositive()
  servicoId: number;

  @IsInt() @IsPositive()
  quantidade: number; // quantas execuções do serviço

  @IsString() @IsOptional()
  refTipo?: string;

  @IsString() @IsOptional()
  refId?: string;
}
//Crie src/stock/dto/execute-service.dto.ts (pra baixar estoque usando o BOM do serviço):