import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('agendamentos')
@UseGuards(JwtAuthGuard)
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto, @Request() req) {
    console.log('🔍 Backend - Criando agendamento:', createAgendamentoDto);
    console.log('🔍 Backend - Usuário autenticado:', req.user);
    return this.agendamentosService.create(createAgendamentoDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    console.log('🔍 Backend - Atualizando agendamento ID:', id, 'dados:', updateAgendamentoDto);
    return this.agendamentosService.update(id, updateAgendamentoDto);
  }

  @Get()
  findAll() {
    return this.agendamentosService.findAll();
  }

  @Get('cliente/:id')
  findByCliente(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentosService.findByCliente(id);
  }

  @Get('servicos-pagos/:clienteId')
  findServicosPagosNaoAgendados(@Param('clienteId', ParseIntPipe) clienteId: number) {
    console.log('🔍 Backend - Buscando serviços pagos não agendados para cliente:', clienteId);
    return this.agendamentosService.findServicosPagosNaoAgendados(clienteId);
  }

  @Get('profissional/:id')
  findByProfissional(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentosService.findByProfissional(id);
  }

  @Get('periodo')
  findByPeriodo(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('profissionalId') profissionalId?: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const profId = profissionalId ? parseInt(profissionalId) : undefined;
    
    return this.agendamentosService.findByPeriodo(start, end, profId);
  }

  @Get('disponibilidade')
  async verificarDisponibilidade(
    @Query('profissionalId', ParseIntPipe) profissionalId: number,
    @Query('startDateTime') startDateTime: string,
    @Query('endDateTime') endDateTime: string,
    @Query('agendamentoId') agendamentoId?: string,
  ) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const agendId = agendamentoId ? parseInt(agendamentoId) : undefined;
    
    const disponivel = await this.agendamentosService.verificarDisponibilidade(
      profissionalId,
      start,
      end,
      agendId,
    );
    
    return { disponivel };
  }


  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentosService.confirmar(id);
  }

  @Patch(':id/cancelar')
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { motivo?: string },
  ) {
    return this.agendamentosService.cancelar(id, body.motivo);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentosService.remove(id);
  }

  // Rota genérica :id deve ficar por último para não interferir nas outras rotas
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendamentosService.findOne(id);
  }
}
