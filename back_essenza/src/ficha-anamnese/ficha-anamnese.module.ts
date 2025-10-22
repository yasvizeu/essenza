import { Module } from '@nestjs/common';
import { FichaAnamneseService } from './ficha-anamnese.service';
import { FichaAnamneseController } from './ficha-anamnese.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichaAnamnese } from './entities/ficha-anamnese.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FichaAnamnese, Cliente])],
  controllers: [FichaAnamneseController],
  providers: [FichaAnamneseService],
  exports: [FichaAnamneseService],
})
export class FichaAnamneseModule {}
