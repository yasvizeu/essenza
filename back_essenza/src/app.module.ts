import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonasModule } from './personas/personas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { FichaAnamneseModule } from './ficha-anamnese/ficha-anamnese.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host:'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'essenza',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), PersonasModule, ClientesModule, ProfissionalModule, FichaAnamneseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
