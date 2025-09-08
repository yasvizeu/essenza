import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ProdutosModule } from '../produtos/produtos.module';
import { ServicosModule } from '../servicos/servicos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { EstoqueModule } from '../estoque/estoque.module';

@Module({
  imports: [ProdutosModule, ServicosModule, ClientesModule, EstoqueModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
