import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMissingTables1756596000000 implements MigrationInterface {
  name = 'CreateMissingTables1756596000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de produtos
    await queryRunner.query(`
      CREATE TABLE \`produtos\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(120) NOT NULL,
        \`emEstoque\` BOOLEAN NOT NULL DEFAULT TRUE,
        \`quantidade\` DECIMAL(10,3) NOT NULL DEFAULT 0,
        \`descricao\` TEXT NULL,
        \`categoria\` VARCHAR(80) NULL,
        \`dataValidade\` DATE NULL,
        \`baseUnit\` VARCHAR(10) NULL DEFAULT 'ml',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de serviços
    await queryRunner.query(`
      CREATE TABLE \`servico\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(140) NOT NULL,
        \`descricao\` TEXT NULL,
        \`preco\` DECIMAL(10,2) NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de relacionamento serviço-produto
    await queryRunner.query(`
      CREATE TABLE \`servico_produtos\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`servicoId\` INT NOT NULL,
        \`produtoId\` INT NOT NULL,
        \`qtyPerService\` DECIMAL(10,3) NOT NULL,
        \`unit\` VARCHAR(10) NOT NULL DEFAULT 'ml',
        \`qtdPorServico\` DECIMAL(10,3) NOT NULL,
        \`unidade\` VARCHAR(10) NOT NULL DEFAULT 'ml',
        \`desperdicioPct\` DECIMAL(5,2) NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_servico_produto\` (\`servicoId\`, \`produtoId\`),
        CONSTRAINT \`fk_sp_servico\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_sp_produto\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de protocolos
    await queryRunner.query(`
      CREATE TABLE \`protocolo\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(140) NOT NULL,
        \`descricao\` TEXT NULL,
        \`observacoes\` TEXT NULL,
        \`dataCriacao\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de relacionamento protocolo-serviço
    await queryRunner.query(`
      CREATE TABLE \`protocol_services\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`protocoloId\` INT NOT NULL,
        \`servicoId\` INT NOT NULL,
        \`ordem\` INT NOT NULL,
        \`duracaoMin\` INT NULL,
        \`observacoes\` TEXT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_protocolo_servico\` (\`protocoloId\`, \`servicoId\`),
        UNIQUE KEY \`uq_protocolo_ordem\` (\`protocoloId\`, \`ordem\`),
        CONSTRAINT \`fk_ps_protocolo\` FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolo\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_ps_servico\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de movimentos de estoque
    await queryRunner.query(`
      CREATE TABLE \`movimentos_estoque\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`produtoId\` INT NOT NULL,
        \`quantidade\` DECIMAL(12,3) NOT NULL,
        \`motivo\` VARCHAR(30) NOT NULL,
        \`refTipo\` VARCHAR(40) NULL,
        \`refId\` VARCHAR(64) NULL,
        \`criadoEm\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_me_produto\` (\`produtoId\`),
        INDEX \`idx_me_produto_criadoEm\` (\`produtoId\`, \`criadoEm\`),
        CONSTRAINT \`fk_me_produto\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // As colunas emEstoque e quantidade já estão incluídas na criação da tabela produtos
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter na ordem inversa
    await queryRunner.query('DROP TABLE IF EXISTS `movimentos_estoque`');
    await queryRunner.query('DROP TABLE IF EXISTS `protocol_services`');
    await queryRunner.query('DROP TABLE IF EXISTS `protocolo`');
    await queryRunner.query('DROP TABLE IF EXISTS `servico_produtos`');
    await queryRunner.query('DROP TABLE IF EXISTS `servico`');
    await queryRunner.query('DROP TABLE IF EXISTS `produtos`');
  }
}
