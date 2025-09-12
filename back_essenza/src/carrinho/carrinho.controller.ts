import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarrinhoService } from './carrinho.service';
import { AdicionarAoCarrinhoDto, AtualizarCarrinhoDto } from './dto/carrinho.dto';

@Controller('carrinho')
@UseGuards(JwtAuthGuard)
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  // Adicionar item ao carrinho
  @Post('adicionar')
  async adicionarAoCarrinho(
    @Request() req: any,
    @Body() dto: AdicionarAoCarrinhoDto
  ) {
    const clienteId = req.user.id;
    return await this.carrinhoService.adicionarAoCarrinho(clienteId, dto);
  }

  // Obter carrinho do cliente
  @Get()
  async obterCarrinho(@Request() req: any) {
    const clienteId = req.user.id;
    return await this.carrinhoService.obterCarrinho(clienteId);
  }

  // Atualizar quantidade de um item
  @Put(':itemId')
  async atualizarQuantidade(
    @Request() req: any,
    @Param('itemId') itemId: number,
    @Body() dto: AtualizarCarrinhoDto
  ) {
    const clienteId = req.user.id;
    return await this.carrinhoService.atualizarQuantidade(clienteId, itemId, dto);
  }

  // Remover item do carrinho
  @Delete(':itemId')
  async removerItem(
    @Request() req: any,
    @Param('itemId') itemId: number
  ) {
    const clienteId = req.user.id;
    await this.carrinhoService.removerItem(clienteId, itemId);
    return { message: 'Item removido do carrinho' };
  }

  // Limpar carrinho
  @Delete()
  async limparCarrinho(@Request() req: any) {
    const clienteId = req.user.id;
    await this.carrinhoService.limparCarrinho(clienteId);
    return { message: 'Carrinho limpo' };
  }

  // Verificar se item está no carrinho
  @Get('verificar/:servicoId')
  async verificarItem(
    @Request() req: any,
    @Param('servicoId') servicoId: number
  ) {
    const clienteId = req.user.id;
    const isInCart = await this.carrinhoService.isItemNoCarrinho(clienteId, servicoId);
    const quantidade = await this.carrinhoService.getQuantidadeItem(clienteId, servicoId);
    
    return {
      isInCart,
      quantidade
    };
  }
}
