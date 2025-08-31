import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProtocolosService } from './protocolos.service';
import { CreateProtocoloDto } from './dto/create-protocolo.dto';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto';
import { UpdateProtocoloStepsDto } from './dto/update-protocolo-steps.dto';

@Controller('protocolos')
export class ProtocolosController {
  constructor(private readonly protocolosService: ProtocolosService) {}

  @Post()
  create(@Body() body: {nome: string; descricao: string; observacoes?: string}) {
    return this.protocolosService.create(body.nome, body.observacoes);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.protocolosService.findOneWithSteps(id);
  }

  @Post(':id/steps')
  syncSteps(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProtocoloStepsDto) {
    return this.protocolosService.updateSteps(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.protocolosService.remove(id);
  }


}
