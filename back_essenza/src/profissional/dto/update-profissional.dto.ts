import { PartialType } from '@nestjs/mapped-types';
import { CreateProfissionalDto } from './create-profissional.dto';

export class UpdateProfissionalDto extends PartialType(CreateProfissionalDto) {}
