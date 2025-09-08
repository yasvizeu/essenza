import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1757082864595 implements MigrationInterface {
    name = 'Init1757082864595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`servico\` ADD \`disponivel\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`servico\` ADD \`categoria\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`servico\` ADD \`duracao\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`servico\` ADD \`imagem\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` DROP FOREIGN KEY \`FK_09a0762f193ec4695695e03ca8c\``);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refTipo\` \`refTipo\` varchar(40) NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refId\` \`refId\` varchar(64) NULL`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`produtoId\` \`produtoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`protocolo\` CHANGE \`observacoes\` \`observacoes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`protocolo\` CHANGE \`dataCriacao\` \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`descricao\` \`descricao\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`categoria\` \`categoria\` varchar(80) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`dataValidade\` \`dataValidade\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_8e5906e5bf0d7dcf45db631999d\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_1a4d81d235ee1a9ef7df057b128\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` CHANGE \`servicoId\` \`servicoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` CHANGE \`produtoId\` \`produtoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` CHANGE \`clienteId\` \`clienteId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` CHANGE \`fichaAnamneseId\` \`fichaAnamneseId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`location\` \`location\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`valor\` \`valor\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`observacoes\` \`observacoes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`googleEventId\` \`googleEventId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_c50c49a92d65f55b4a652a4e963\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_9ec0c238a6e88254763adbf77a4\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` ON \`protocol_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_f21e52e617f263f66d6920e6e2\` ON \`protocol_services\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`duracaoMin\` \`duracaoMin\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`observacoes\` \`observacoes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`protocoloId\` \`protocoloId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`servicoId\` \`servicoId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` ON \`protocol_services\` (\`protocoloId\`, \`ordem\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f21e52e617f263f66d6920e6e2\` ON \`protocol_services\` (\`protocoloId\`, \`servicoId\`)`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` ADD CONSTRAINT \`FK_09a0762f193ec4695695e03ca8c\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_8e5906e5bf0d7dcf45db631999d\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_1a4d81d235ee1a9ef7df057b128\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_c50c49a92d65f55b4a652a4e963\` FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_9ec0c238a6e88254763adbf77a4\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_9ec0c238a6e88254763adbf77a4\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` DROP FOREIGN KEY \`FK_c50c49a92d65f55b4a652a4e963\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_1a4d81d235ee1a9ef7df057b128\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_8e5906e5bf0d7dcf45db631999d\``);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` DROP FOREIGN KEY \`FK_09a0762f193ec4695695e03ca8c\``);
        await queryRunner.query(`DROP INDEX \`IDX_f21e52e617f263f66d6920e6e2\` ON \`protocol_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` ON \`protocol_services\``);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`servicoId\` \`servicoId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`protocoloId\` \`protocoloId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`observacoes\` \`observacoes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` CHANGE \`duracaoMin\` \`duracaoMin\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f21e52e617f263f66d6920e6e2\` ON \`protocol_services\` (\`protocoloId\`, \`servicoId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e3a8efeecdc06ac592f4545f95\` ON \`protocol_services\` (\`protocoloId\`, \`ordem\`)`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_9ec0c238a6e88254763adbf77a4\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocol_services\` ADD CONSTRAINT \`FK_c50c49a92d65f55b4a652a4e963\` FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`googleEventId\` \`googleEventId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`observacoes\` \`observacoes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`valor\` \`valor\` decimal(10,2) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`location\` \`location\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cliente\` CHANGE \`fichaAnamneseId\` \`fichaAnamneseId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` CHANGE \`clienteId\` \`clienteId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` CHANGE \`produtoId\` \`produtoId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` CHANGE \`servicoId\` \`servicoId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_1a4d81d235ee1a9ef7df057b128\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_8e5906e5bf0d7dcf45db631999d\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`dataValidade\` \`dataValidade\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`categoria\` \`categoria\` varchar(80) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`descricao\` \`descricao\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`protocolo\` CHANGE \`dataCriacao\` \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`protocolo\` CHANGE \`observacoes\` \`observacoes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`produtoId\` \`produtoId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refId\` \`refId\` varchar(64) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` CHANGE \`refTipo\` \`refTipo\` varchar(40) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` ADD CONSTRAINT \`FK_09a0762f193ec4695695e03ca8c\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`imagem\``);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`duracao\``);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`categoria\``);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`disponivel\``);
    }

}
