import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ExecuteServiceDto } from './dto/execute-service.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inv: InventarioService) {}

   // saldo de um produto
  @Get('produtos/:id/saldo')
  getSaldo(@Param('id', ParseIntPipe) id: number) {
    return this.inv.saldoProduto(id);
  }

  // extrato (últimos N)
  @Get('produtos/:id/extrato')
  getExtrato(@Param('id', ParseIntPipe) id: number, @Query('limit') limit = 50) {
    return this.inv.extratoProduto(id, Number(limit));
  }

  // entrada/ajuste manual
  @Post('estoque/movimentos')
  criarMovimento(@Body() dto: CreateMovementDto) {
    return this.inv.lancarMovimento(dto);
  }

  // baixa automática ao executar um serviço
  @Post('ordens-servico/execucoes')
  executarServico(@Body() dto: ExecuteServiceDto) {
    return this.inv.executarServico(dto);
  }

  // estornar um movimento
  @Post('estoque/movimentos/:id/estorno')
  estornar(@Param('id', ParseIntPipe) id: number) {
    return this.inv.estornar(id);
  }
}