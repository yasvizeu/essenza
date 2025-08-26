import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Profissional } from 'src/profissional/entities/profissional.entity';
import { Persona } from './entities/persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Profissional])],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [TypeOrmModule],
})
export class PersonasModule {}
