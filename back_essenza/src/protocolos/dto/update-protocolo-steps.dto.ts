import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive } from 'class-validator';

class StepDto {
  @IsInt() @IsPositive()
  servicoId: number;

  @IsInt() @IsPositive()
  ordem: number;

  @IsInt() @IsOptional()
  duracaoMin?: number;
}

export class UpdateProtocoloStepsDto {
  @IsArray() @ArrayNotEmpty()
  @Type(() => StepDto)
  steps: StepDto[];
}