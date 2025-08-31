import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';    
import { MovEstoque } from './stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovEstoque])],
  providers: [InventarioService],
  controllers: [InventarioController],
  exports: [InventarioService],
})
export class EstoqueModule {}
//o TypeOrmModule.forFeature([MovEstoque]) permite injetar o repositório dessa tabela no service.