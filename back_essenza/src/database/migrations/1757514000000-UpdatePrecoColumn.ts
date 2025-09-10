import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePrecoColumn1757514000000 implements MigrationInterface {
    name = 'UpdatePrecoColumn1757514000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a coluna preco existe e atualizar seu tipo
        const table = await queryRunner.getTable("servico");
        const precoColumn = table?.findColumnByName("preco");
        
        if (precoColumn) {
            // Atualizar o tipo da coluna preco para decimal com precisão
            await queryRunner.query(`ALTER TABLE \`servico\` MODIFY COLUMN \`preco\` DECIMAL(10,2) NOT NULL`);
        }

        // Garantir que não há valores nulos na coluna preco
        await queryRunner.query(`UPDATE \`servico\` SET \`preco\` = 0.00 WHERE \`preco\` IS NULL`);
        
        // Garantir que a coluna não aceita NULL
        await queryRunner.query(`ALTER TABLE \`servico\` MODIFY COLUMN \`preco\` DECIMAL(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter para o tipo anterior
        await queryRunner.query(`ALTER TABLE \`servico\` MODIFY COLUMN \`preco\` DECIMAL(10,2) NULL`);
    }
}
