import { Module } from '@nestjs/common';
import { ProfissionalService } from './profissional.service';
import { ProfissionalController } from './profissional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Profissional } from './entities/profissional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profissional])],
  controllers: [ProfissionalController],
  providers: [ProfissionalService],
  exports:[TypeOrmModule, ProfissionalService],
})
export class ProfissionalModule {}
