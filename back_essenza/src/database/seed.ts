// src/database/seed.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Profissional } from '../profissional/entities/profissional.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Servico } from '../servicos/entities/servico.entity';
import { ServicoProduto } from '../servicos/entities/servico-produto.entity';
import * as bcrypt from 'bcryptjs';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'essenza',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  charset: 'utf8mb4_unicode_ci',
  logging: false,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Conexão com banco estabelecida');

    const profissionalRepository = dataSource.getRepository(Profissional);
    const clienteRepository = dataSource.getRepository(Cliente);
    const produtoRepository = dataSource.getRepository(Produto);
    const servicoRepository = dataSource.getRepository(Servico);
    const servicoProdutoRepository = dataSource.getRepository(ServicoProduto);

    // Verificar se já existem usuários em cada tabela separadamente
    const existingProfissionais = await profissionalRepository.find();
    const existingClientes = await clienteRepository.find();
    const existingProdutos = await produtoRepository.find();
    const existingServicos = await servicoRepository.find();
    
    console.log(`Profissionais existentes: ${existingProfissionais.length}`);
    console.log(`Clientes existentes: ${existingClientes.length}`);
    console.log(`Produtos existentes: ${existingProdutos.length}`);
    console.log(`Serviços existentes: ${existingServicos.length}`);
    
    // Só criar se não existirem usuários em ambas as tabelas
    if (existingProfissionais.length > 0 && existingClientes.length > 0) {
      console.log('Usuários já existem em ambas as tabelas, mas vamos verificar se as senhas estão hasheadas...');
      
      // Verificar se a senha do profissional está hasheada
      const profissional = existingProfissionais[0];
      if (profissional.password === 'Admin123@') {
        console.log('⚠️ Senha do profissional não está hasheada! Vamos recriar...');
        // Deletar o profissional existente para recriar com senha hasheada
        await profissionalRepository.remove(profissional);
        console.log('🗑️ Profissional removido para recriação');
        // Atualizar a variável para refletir a remoção
        existingProfissionais.length = 0;
      } else {
        console.log('✅ Senhas já estão hasheadas, pulando seed de usuários');
      }
    }

    // Criar usuário profissional se não existir
    if (existingProfissionais.length === 0) {
      console.log('Criando usuário profissional...');
      const hashedSenhaProfissional = await bcrypt.hash('Admin123@', 12);
      const profissional = profissionalRepository.create({
        email: 'admin@exemplo.com',
        name: 'Admin',
        password: hashedSenhaProfissional,
        type: 'profissional',
        cpf: '123.456.789-00',
        birthDate: '1990-01-01',
        cell: '11987654321',
        address: 'Rua Admin, 123',
        especialidade: 'Administração',
        admin: true,
        cnec: 123456,
      });
      await profissionalRepository.save(profissional);
      console.log('✅ Profissional criado com sucesso!');
    } else {
      console.log('ℹ️ Profissional já existe, pulando...');
    }

    // Criar usuário cliente se não existir
    if (existingClientes.length === 0) {
      console.log('Criando usuário cliente...');
      const hashedSenhaCliente = await bcrypt.hash('Cliente123@', 12);
      const cliente = clienteRepository.create({
        email: 'cliente@exemplo.com',
        name: 'Cliente Teste',
        password: hashedSenhaCliente,
        type: 'cliente',
        cpf: '987.654.321-00',
        birthDate: '1995-05-15',
        cell: '11987654322',
        address: 'Rua Cliente, 456',
      });
      await clienteRepository.save(cliente);
      console.log('✅ Cliente criado com sucesso!');
    } else {
      console.log('ℹ️ Cliente já existe, pulando...');
    }

    // Criar produtos se não existirem
    if (existingProdutos.length === 0) {
      console.log('Criando produtos...');
      
      const produtos = [
        {
          nome: 'Óleo de Argan',
          emEstoque: true,
          quantidade: 500.0,
          descricao: 'Óleo de argan puro para tratamento capilar',
          categoria: 'Óleos',
          dataValidade: '2025-12-31',
          baseUnit: 'ml'
        },
        {
          nome: 'Máscara de Argila',
          emEstoque: true,
          quantidade: 200.0,
          descricao: 'Máscara facial de argila verde',
          categoria: 'Máscaras',
          dataValidade: '2025-10-15',
          baseUnit: 'g'
        },
        {
          nome: 'Sérum Vitamina C',
          emEstoque: true,
          quantidade: 100.0,
          descricao: 'Sérum facial com vitamina C estabilizada',
          categoria: 'Séruns',
          dataValidade: '2025-08-30',
          baseUnit: 'ml'
        },
        {
          nome: 'Protetor Solar FPS 50',
          emEstoque: true,
          quantidade: 150.0,
          descricao: 'Protetor solar facial com FPS 50',
          categoria: 'Protetores',
          dataValidade: '2025-06-20',
          baseUnit: 'ml'
        },
        {
          nome: 'Hidratante Facial',
          emEstoque: true,
          quantidade: 80.0,
          descricao: 'Creme hidratante facial para todos os tipos de pele',
          categoria: 'Hidratantes',
          dataValidade: '2025-09-15',
          baseUnit: 'ml'
        }
      ];

      for (const produtoData of produtos) {
        const produto = produtoRepository.create(produtoData);
        await produtoRepository.save(produto);
        console.log(`✅ Produto criado: ${produto.nome}`);
      }
    } else {
      console.log('ℹ️ Produtos já existem, pulando...');
    }

    // Criar serviços se não existirem
    if (existingServicos.length === 0) {
      console.log('Criando serviços...');
      
      const servicos = [
        {
          nome: 'Limpeza de Pele Profunda',
          descricao: 'Limpeza completa com extração de cravos e espinhas',
          preco: 120.00
        },
        {
          nome: 'Tratamento Anti-idade',
          descricao: 'Tratamento com produtos específicos para rugas e linhas de expressão',
          preco: 180.00
        },
        {
          nome: 'Hidratação Intensiva',
          descricao: 'Hidratação profunda com máscaras e séruns',
          preco: 95.00
        },
        {
          nome: 'Peeling Químico',
          descricao: 'Renovação celular com ácidos específicos',
          preco: 250.00
        },
        {
          nome: 'Tratamento para Acne',
          descricao: 'Tratamento específico para peles acneicas',
          preco: 150.00
        }
      ];

      for (const servicoData of servicos) {
        const servico = servicoRepository.create(servicoData);
        await servicoRepository.save(servico);
        console.log(`✅ Serviço criado: ${servico.nome}`);
      }
    } else {
      console.log('ℹ️ Serviços já existem, pulando...');
    }

    // Criar relacionamentos serviço-produto se não existirem
    if (existingServicos.length > 0 && existingProdutos.length > 0) {
      console.log('Verificando relacionamentos serviço-produto...');
      
      const existingRelacionamentos = await servicoProdutoRepository.find();
      
      if (existingRelacionamentos.length === 0) {
        console.log('Criando relacionamentos serviço-produto...');
        
        // Buscar produtos e serviços criados
        const produtos = await produtoRepository.find();
        const servicos = await servicoRepository.find();
        
        // Criar relacionamentos exemplo
        const relacionamentos = [
          {
            servico: servicos[0], // Limpeza de Pele
            produto: produtos[1], // Máscara de Argila
            qtyPerService: 30.0,
            unit: 'g',
            qtdPorServico: 30.0,
            unidade: 'g',
            desperdicioPct: 5.0
          },
          {
            servico: servicos[0], // Limpeza de Pele
            produto: produtos[2], // Sérum Vitamina C
            qtyPerService: 5.0,
            unit: 'ml',
            qtdPorServico: 5.0,
            unidade: 'ml',
            desperdicioPct: 2.0
          },
          {
            servico: servicos[1], // Tratamento Anti-idade
            produto: produtos[2], // Sérum Vitamina C
            qtyPerService: 8.0,
            unit: 'ml',
            qtdPorServico: 8.0,
            unidade: 'ml',
            desperdicioPct: 3.0
          },
          {
            servico: servicos[1], // Tratamento Anti-idade
            produto: produtos[4], // Hidratante Facial
            qtyPerService: 15.0,
            unit: 'ml',
            qtdPorServico: 15.0,
            unidade: 'ml',
            desperdicioPct: 4.0
          },
          {
            servico: servicos[2], // Hidratação Intensiva
            produto: produtos[0], // Óleo de Argan
            qtyPerService: 10.0,
            unit: 'ml',
            qtdPorServico: 10.0,
            unidade: 'ml',
            desperdicioPct: 2.0
          }
        ];

        for (const relData of relacionamentos) {
          const relacionamento = servicoProdutoRepository.create(relData);
          await servicoProdutoRepository.save(relacionamento);
          console.log(`✅ Relacionamento criado: ${relData.servico.nome} + ${relData.produto.nome}`);
        }
      } else {
        console.log('ℹ️ Relacionamentos serviço-produto já existem, pulando...');
      }
    }

    console.log('\n📊 Resumo do Seed:');
    console.log('Profissional:', {
      email: 'admin@exemplo.com',
      senha: 'Admin123@',
      tipo: 'profissional'
    });

    console.log('Cliente:', {
      email: 'cliente@exemplo.com',
      senha: 'Cliente123@',
      tipo: 'cliente'
    });

    console.log(`\n✅ Seed concluído com sucesso!`);
    console.log(`📦 Produtos criados: ${(await produtoRepository.find()).length}`);
    console.log(`🔧 Serviços criados: ${(await servicoRepository.find()).length}`);
    console.log(`🔗 Relacionamentos criados: ${(await servicoProdutoRepository.find()).length}`);

  } catch (error) {
    console.error('Erro durante seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
