import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProtocolos1756595555555 implements MigrationInterface {
  name = 'AddProtocolos1756595555555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`protocolos\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(140) NOT NULL,
        \`observacoes\` TEXT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE \`protocolos_servicos\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`protocoloId\` INT NOT NULL,
        \`servicoId\` INT NOT NULL,
        \`ordem\` INT NOT NULL,
        \`duracaoMin\` INT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_protocolo_servico\` (\`protocoloId\`, \`servicoId\`),
        UNIQUE KEY \`uq_protocolo_ordem\` (\`protocoloId\`, \`ordem\`),
        KEY \`idx_ps_protocolo\` (\`protocoloId\`),
        CONSTRAINT \`fk_ps_protocolo\`
          FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolos\`(\`id\`)
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`fk_ps_servico\`
          FOREIGN KEY (\`servicoId\`) REFERENCES \`servicos\`(\`id\`)
          ON DELETE RESTRICT ON UPDATE NO ACTION
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `protocolos_servicos`');
    await queryRunner.query('DROP TABLE `protocolos`');
  }
}
