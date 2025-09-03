import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';
import { Agendamento } from './entities/agendamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agendamento])],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
  exports: [AgendamentosService],
})
export class AgendamentosModule {}
