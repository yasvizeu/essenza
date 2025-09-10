import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { Carrinho } from './entities/carrinho.entity';
import { Servico } from '../servicos/entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrinho, Servico])],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
  exports: [CarrinhoService]
})
export class CarrinhoModule {}
