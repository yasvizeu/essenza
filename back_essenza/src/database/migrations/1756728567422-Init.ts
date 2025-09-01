import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756728567422 implements MigrationInterface {
    name = 'Init1756728567422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` DROP FOREIGN KEY \`fk_me_produto\``);
        await queryRunner.query(`DROP INDEX \`idx_me_produto\` ON \`movimentos_estoque\``);
        await queryRunner.query(`DROP INDEX \`idx_me_produto_criadoEm\` ON \`movimentos_estoque\``);
        await queryRunner.query(`CREATE TABLE \`servico_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`qtyPerService\` decimal(10,3) NOT NULL, \`unit\` varchar(10) NOT NULL DEFAULT 'ml', \`qtdPorServico\` decimal(10,3) NOT NULL, \`unidade\` varchar(10) NOT NULL DEFAULT 'ml', \`desperdicioPct\` decimal(5,2) NOT NULL DEFAULT '0.00', \`servicoId\` int NULL, \`produtoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`protocolo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`observacoes\` text NULL, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`protocol_services\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ordem\` int NOT NULL, \`duracaoMin\` int NULL, \`observacoes\` text NULL, \`protocoloId\` int NULL, \`servicoId\` int NULL, INDEX \`IDX_c50c49a92d65f55b4a652a4e96\` (\`protocoloId\`), UNIQUE INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` (\`protocoloId\`, \`ordem\`), UNIQUE INDEX \`IDX_f21e52e617f263f66d6920e6e2\` (\`protocoloId\`, \`servicoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`servicos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`preco\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refTipo\` \`refTipo\` varchar(40) NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refId\` \`refId\` varchar(64) NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`produtoId\` \`produtoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` CHANGE \`clienteId\` \`clienteId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`profissional\` CHANGE \`admin\` \`admin\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`profissional\` CHANGE \`cnec\` \`cnec\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`descricao\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`descricao\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`categoria\` \`categoria\` varchar(80) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`dataValidade\` \`dataValidade\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` CHANGE \`fichaAnamneseId\` \`fichaAnamneseId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_09a0762f193ec4695695e03ca8\` ON \`movimentos_estoque\` (\`produtoId\`)`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` ADD CONSTRAINT \`FK_09a0762f193ec4695695e03ca8c\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_8e5906e5bf0d7dcf45db631999d\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servicos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_1a4d81d235ee1a9ef7df057b128\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_c50c49a92d65f55b4a652a4e963\` FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_9ec0c238a6e88254763adbf77a4\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servicos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_9ec0c238a6e88254763adbf77a4\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_c50c49a92d65f55b4a652a4e963\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_1a4d81d235ee1a9ef7df057b128\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_8e5906e5bf0d7dcf45db631999d\``);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` DROP FOREIGN KEY \`FK_09a0762f193ec4695695e03ca8c\``);
        await queryRunner.query(`DROP INDEX \`IDX_09a0762f193ec4695695e03ca8\` ON \`movimentos_estoque\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` CHANGE \`fichaAnamneseId\` \`fichaAnamneseId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`dataValidade\` \`dataValidade\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`categoria\` \`categoria\` varchar(80) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`descricao\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`descricao\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`profissional\` CHANGE \`cnec\` \`cnec\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`profissional\` CHANGE \`admin\` \`admin\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` CHANGE \`clienteId\` \`clienteId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`produtoId\` \`produtoId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refId\` \`refId\` varchar(64) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refTipo\` \`refTipo\` varchar(40) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`servicos\``);
        await queryRunner.query(`DROP INDEX \`IDX_f21e52e617f263f66d6920e6e2\` ON \`protocol_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` ON \`protocol_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_c50c49a92d65f55b4a652a4e96\` ON \`protocol_services\``);
        await queryRunner.query(`DROP TABLE \`protocol_services\``);
        await queryRunner.query(`DROP TABLE \`protocolo\``);
        await queryRunner.query(`DROP TABLE \`servico_produtos\``);
        await queryRunner.query(`CREATE INDEX \`idx_me_produto_criadoEm\` ON \`movimentos_estoque\` (\`produtoId\`, \`criadoEm\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_me_produto\` ON \`movimentos_estoque\` (\`produtoId\`)`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` ADD CONSTRAINT \`fk_me_produto\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
