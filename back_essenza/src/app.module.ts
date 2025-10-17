import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonasModule } from './personas/personas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { FichaAnamneseModule } from './ficha-anamnese/ficha-anamnese.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from './produtos/produtos.module';
import { ServicosModule } from './servicos/servicos.module';
import { ProtocolosModule } from './protocolos/protocolos.module';
import { EstoqueModule } from './estoque/estoque.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import 'dotenv/config';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'essenza',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', // Apenas em desenvolvimento
    charset: 'utf8mb4_unicode_ci',
    logging: process.env.NODE_ENV === 'development',
  }), AuthModule, PersonasModule, ClientesModule, ProfissionalModule, FichaAnamneseModule, ProdutosModule, ServicosModule, ProtocolosModule, EstoqueModule, DashboardModule, AgendamentosModule, CarrinhoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
