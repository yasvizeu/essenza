import { Module } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { ServicosController } from './servicos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { Produto } from 'src/produtos/entities/produto.entity';
import { ServicoProduto } from './entities/servico-produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servico, Produto, ServicoProduto])],
  controllers: [ServicosController],
  providers: [ServicosService],
  exports: [ServicosService],
})
export class ServicosModule {}
