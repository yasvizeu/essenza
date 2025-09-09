import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1757432995361 implements MigrationInterface {
    name = 'CreateAllTables1757432995361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`movimentos_estoque\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantidade\` decimal(12,3) NOT NULL, \`motivo\` varchar(30) NOT NULL, \`refTipo\` varchar(40) NULL, \`refId\` varchar(64) NULL, \`criadoEm\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`produtoId\` int NULL, INDEX \`IDX_09a0762f193ec4695695e03ca8\` (\`produtoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`servico\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`preco\` int NOT NULL, \`disponivel\` tinyint NOT NULL DEFAULT 1, \`categoria\` varchar(255) NULL, \`duracao\` int NULL, \`imagem\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`servico_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`qtyPerService\` decimal(10,3) NOT NULL, \`unit\` varchar(10) NOT NULL DEFAULT 'ml', \`qtdPorServico\` decimal(10,3) NOT NULL, \`unidade\` varchar(10) NOT NULL DEFAULT 'ml', \`desperdicioPct\` decimal(5,2) NOT NULL DEFAULT '0.00', \`servicoId\` int NULL, \`produtoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`protocolo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` varchar(255) NOT NULL, \`observacoes\` text NULL, \`dataCriacao\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`protocolo_servico\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ordem\` int NOT NULL, \`duracaoMin\` int NULL, \`observacoes\` text NULL, \`protocoloId\` int NULL, \`servicoId\` int NULL, INDEX \`IDX_4b99982c4d090e39d44a8e62c0\` (\`protocoloId\`), UNIQUE INDEX \`IDX_3ac0e8344e804035747ba8b708\` (\`protocoloId\`, \`ordem\`), UNIQUE INDEX \`IDX_8b7ee557be9b3c9d3e5bec2bb1\` (\`protocoloId\`, \`servicoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profissional\` (\`name\` varchar(255) NOT NULL, \`birthDate\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`cell\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`admin\` tinyint NOT NULL, \`especialidade\` varchar(255) NOT NULL, \`cnec\` int NOT NULL, UNIQUE INDEX \`IDX_cdd86bd77ca5e409ce1beb0a4b\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(120) NOT NULL, \`descricao\` varchar(255) NULL, \`categoria\` varchar(80) NULL, \`dataValidade\` date NULL, \`baseUnit\` varchar(10) NULL DEFAULT 'ml', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ficha_anamnese\` (\`id\` int NOT NULL AUTO_INCREMENT, \`healthProblems\` varchar(255) NOT NULL, \`medications\` varchar(255) NOT NULL, \`allergies\` varchar(255) NOT NULL, \`surgeries\` varchar(255) NOT NULL, \`lifestyle\` varchar(255) NOT NULL, \`clienteId\` int NULL, UNIQUE INDEX \`REL_b08dc17af8491da086e22bd1a6\` (\`clienteId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cliente\` (\`name\` varchar(255) NOT NULL, \`birthDate\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`cell\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`fichaAnamneseId\` int NULL, UNIQUE INDEX \`IDX_980ea33e938c719bbababe4352\` (\`cpf\`), UNIQUE INDEX \`REL_a6e036a4f6506bf7abd4d39ca7\` (\`fichaAnamneseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`agendamentos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`startDateTime\` datetime NOT NULL, \`endDateTime\` datetime NOT NULL, \`timeZone\` varchar(50) NOT NULL DEFAULT 'America/Sao_Paulo', \`location\` varchar(255) NULL, \`status\` enum ('confirmed', 'tentative', 'cancelled') NOT NULL DEFAULT 'tentative', \`statusPagamento\` enum ('pendente', 'pago', 'cancelado') NOT NULL DEFAULT 'pendente', \`valor\` decimal(10,2) NULL, \`observacoes\` text NULL, \`googleEventId\` varchar(255) NULL, \`clienteId\` int NOT NULL, \`profissionalId\` int NOT NULL, \`servicoId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` ADD CONSTRAINT \`FK_09a0762f193ec4695695e03ca8c\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_8e5906e5bf0d7dcf45db631999d\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` ADD CONSTRAINT \`FK_1a4d81d235ee1a9ef7df057b128\` FOREIGN KEY (\`produtoId\`) REFERENCES \`produtos\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocolo_servico\` ADD CONSTRAINT \`FK_4b99982c4d090e39d44a8e62c0b\` FOREIGN KEY (\`protocoloId\`) REFERENCES \`protocolo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`protocolo_servico\` ADD CONSTRAINT \`FK_e6e4b3fd1810882b7db219c0a79\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` ADD CONSTRAINT \`FK_c0889d163bf514dbd5779c6d83f\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` ADD CONSTRAINT \`FK_9c00255b5af1d399d07ce9d1d0d\` FOREIGN KEY (\`profissionalId\`) REFERENCES \`profissional\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` ADD CONSTRAINT \`FK_52fd55eb88d0e9275694f688473\` FOREIGN KEY (\`servicoId\`) REFERENCES \`servico\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`agendamentos\` DROP FOREIGN KEY \`FK_52fd55eb88d0e9275694f688473\``);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` DROP FOREIGN KEY \`FK_9c00255b5af1d399d07ce9d1d0d\``);
        await queryRunner.query(`ALTER TABLE \`agendamentos\` DROP FOREIGN KEY \`FK_c0889d163bf514dbd5779c6d83f\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`protocolo_servico\` DROP FOREIGN KEY \`FK_e6e4b3fd1810882b7db219c0a79\``);
        await queryRunner.query(`ALTER TABLE \`protocolo_servico\` DROP FOREIGN KEY \`FK_4b99982c4d090e39d44a8e62c0b\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_1a4d81d235ee1a9ef7df057b128\``);
        await queryRunner.query(`ALTER TABLE \`servico_produtos\` DROP FOREIGN KEY \`FK_8e5906e5bf0d7dcf45db631999d\``);
        await queryRunner.query(`ALTER TABLE \`movimentos_estoque\` DROP FOREIGN KEY \`FK_09a0762f193ec4695695e03ca8c\``);
        await queryRunner.query(`DROP TABLE \`agendamentos\``);
        await queryRunner.query(`DROP INDEX \`REL_a6e036a4f6506bf7abd4d39ca7\` ON \`cliente\``);
        await queryRunner.query(`DROP INDEX \`IDX_980ea33e938c719bbababe4352\` ON \`cliente\``);
        await queryRunner.query(`DROP TABLE \`cliente\``);
        await queryRunner.query(`DROP INDEX \`REL_b08dc17af8491da086e22bd1a6\` ON \`ficha_anamnese\``);
        await queryRunner.query(`DROP TABLE \`ficha_anamnese\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP INDEX \`IDX_cdd86bd77ca5e409ce1beb0a4b\` ON \`profissional\``);
        await queryRunner.query(`DROP TABLE \`profissional\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b7ee557be9b3c9d3e5bec2bb1\` ON \`protocolo_servico\``);
        await queryRunner.query(`DROP INDEX \`IDX_3ac0e8344e804035747ba8b708\` ON \`protocolo_servico\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b99982c4d090e39d44a8e62c0\` ON \`protocolo_servico\``);
        await queryRunner.query(`DROP TABLE \`protocolo_servico\``);
        await queryRunner.query(`DROP TABLE \`protocolo\``);
        await queryRunner.query(`DROP TABLE \`servico_produtos\``);
        await queryRunner.query(`DROP TABLE \`servico\``);
        await queryRunner.query(`DROP INDEX \`IDX_09a0762f193ec4695695e03ca8\` ON \`movimentos_estoque\``);
        await queryRunner.query(`DROP TABLE \`movimentos_estoque\``);
    }

}
