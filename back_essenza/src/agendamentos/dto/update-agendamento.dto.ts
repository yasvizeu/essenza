import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';

export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {}
