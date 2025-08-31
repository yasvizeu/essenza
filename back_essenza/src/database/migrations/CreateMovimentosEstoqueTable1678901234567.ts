import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovimentosEstoqueTable1678901234567 implements MigrationInterface {
  name = 'CreateMovimentosEstoqueTable1678901234567';

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS \`produtos\` (
    \`id\` INT NOT NULL AUTO_INCREMENT,
    \`nome\` VARCHAR(120) NOT NULL,
    \`descricao\` TEXT NULL,
    \`categoria\` VARCHAR(80) NULL,
    \`dataValidade\` DATE NULL,
    \`baseUnit\` VARCHAR(10) NULL DEFAULT 'ml',
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB;
`);

    // 1) cria a tabela de movimentos (cada linha = um evento de estoque)
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
        CONSTRAINT \`fk_me_produto\`
          FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`)
          ON DELETE RESTRICT ON UPDATE NO ACTION
      ) ENGINE=InnoDB;
    `);

    // 2) (opcional, mas ótimo) — bloqueia UPDATE/DELETE: só permite INSERT (append-only)
    await queryRunner.query(`
      CREATE TRIGGER \`movimentos_estoque_no_update\`
      BEFORE UPDATE ON \`movimentos_estoque\`
      FOR EACH ROW
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Append-only: UPDATE bloqueado';
    `);

    await queryRunner.query(`
      CREATE TRIGGER \`movimentos_estoque_no_delete\`
      BEFORE DELETE ON \`movimentos_estoque\`
      FOR EACH ROW
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Append-only: DELETE bloqueado';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // reverte os triggers e a tabela
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`movimentos_estoque_no_delete\``);
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`movimentos_estoque_no_update\``);
    await queryRunner.query(`DROP TABLE \`movimentos_estoque\``);
  }
}
