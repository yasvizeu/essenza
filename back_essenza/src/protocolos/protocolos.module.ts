import { Module } from '@nestjs/common';
import { ProtocolosService } from './protocolos.service';
import { ProtocolosController } from './protocolos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Protocolo } from './entities/protocolo.entity';
import { ProtocoloServico as Pivot} from './entities/protocolo-servico.entity';
import { Servico } from '../servicos/entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Protocolo, Pivot , Servico,])],
  controllers: [ProtocolosController],
  providers: [ProtocolosService],
  exports: [ProtocolosService],
})
export class ProtocolosModule {}
