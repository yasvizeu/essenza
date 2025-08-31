import { PartialType } from '@nestjs/mapped-types';
import { CreateProtocoloDto } from './create-protocolo.dto';

export class UpdateProtocoloDto extends PartialType(CreateProtocoloDto) {}
