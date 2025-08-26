import { PartialType } from '@nestjs/mapped-types';
import { CreateFichaAnamneseDto } from './create-ficha-anamnese.dto';

export class UpdateFichaAnamneseDto extends PartialType(CreateFichaAnamneseDto) {}
