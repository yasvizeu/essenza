import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756594905642 implements MigrationInterface {
    name = 'Init1756594905642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profissional\` (\`name\` varchar(255) NOT NULL, \`birthDate\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`cell\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`especialidade\` varchar(255) NOT NULL, \`admin\` tinyint NOT NULL DEFAULT 1, \`cnec\` int NULL, UNIQUE INDEX \`IDX_cdd86bd77ca5e409ce1beb0a4b\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cliente\` (\`name\` varchar(255) NOT NULL, \`birthDate\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`cell\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`fichaAnamneseId\` int NULL, UNIQUE INDEX \`IDX_980ea33e938c719bbababe4352\` (\`cpf\`), UNIQUE INDEX \`REL_a6e036a4f6506bf7abd4d39ca7\` (\`fichaAnamneseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ficha_anamnese\` (\`id\` int NOT NULL AUTO_INCREMENT, \`healthProblems\` varchar(255) NOT NULL, \`medications\` varchar(255) NOT NULL, \`allergies\` varchar(255) NOT NULL, \`surgeries\` varchar(255) NOT NULL, \`lifestyle\` varchar(255) NOT NULL, \`clienteId\` int NULL, UNIQUE INDEX \`REL_b08dc17af8491da086e22bd1a6\` (\`clienteId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cliente\` ADD CONSTRAINT \`FK_a6e036a4f6506bf7abd4d39ca75\` FOREIGN KEY (\`fichaAnamneseId\`) REFERENCES \`ficha_anamnese\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` ADD CONSTRAINT \`FK_b08dc17af8491da086e22bd1a6b\` FOREIGN KEY (\`clienteId\`) REFERENCES \`cliente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ficha_anamnese\` DROP FOREIGN KEY \`FK_b08dc17af8491da086e22bd1a6b\``);
        await queryRunner.query(`ALTER TABLE \`cliente\` DROP FOREIGN KEY \`FK_a6e036a4f6506bf7abd4d39ca75\``);
        await queryRunner.query(`DROP INDEX \`REL_b08dc17af8491da086e22bd1a6\` ON \`ficha_anamnese\``);
        await queryRunner.query(`DROP TABLE \`ficha_anamnese\``);
        await queryRunner.query(`DROP INDEX \`REL_a6e036a4f6506bf7abd4d39ca7\` ON \`cliente\``);
        await queryRunner.query(`DROP INDEX \`IDX_980ea33e938c719bbababe4352\` ON \`cliente\``);
        await queryRunner.query(`DROP TABLE \`cliente\``);
        await queryRunner.query(`DROP INDEX \`IDX_cdd86bd77ca5e409ce1beb0a4b\` ON \`profissional\``);
        await queryRunner.query(`DROP TABLE \`profissional\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
