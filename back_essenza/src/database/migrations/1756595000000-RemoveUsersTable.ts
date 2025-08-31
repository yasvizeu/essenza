import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUsersTable1756595000000 implements MigrationInterface {
    name = 'RemoveUsersTable1756595000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remover a tabela users se ela existir
        await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recriar a tabela users se necessário (rollback)
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
}
