import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { FichaAnamnese } from 'src/ficha-anamnese/entities/ficha-anamnese.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Cliente, FichaAnamnese])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [TypeOrmModule],
})
export class ClientesModule {}
