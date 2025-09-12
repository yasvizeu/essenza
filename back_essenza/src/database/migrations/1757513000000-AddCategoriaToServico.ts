import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriaToServico1757513000000 implements MigrationInterface {
    name = 'AddCategoriaToServico1757513000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se a coluna categoria já existe
        const table = await queryRunner.getTable("servico");
        const categoriaColumn = table?.findColumnByName("categoria");
        
        if (!categoriaColumn) {
            await queryRunner.query(`ALTER TABLE \`servico\` ADD \`categoria\` varchar(255) NOT NULL DEFAULT 'facial'`);
        }

        // Verificar se a coluna duracao já existe
        const duracaoColumn = table?.findColumnByName("duracao");
        
        if (!duracaoColumn) {
            await queryRunner.query(`ALTER TABLE \`servico\` ADD \`duracao\` int NULL`);
        }

        // Verificar se a coluna imagem já existe
        const imagemColumn = table?.findColumnByName("imagem");
        
        if (!imagemColumn) {
            await queryRunner.query(`ALTER TABLE \`servico\` ADD \`imagem\` varchar(255) NULL`);
        }

        // Atualizar serviços existentes com categorias
        await queryRunner.query(`
            UPDATE \`servico\` 
            SET \`categoria\` = 'facial' 
            WHERE \`categoria\` = 'facial' OR \`categoria\` IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`imagem\``);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`duracao\``);
        await queryRunner.query(`ALTER TABLE \`servico\` DROP COLUMN \`categoria\``);
    }
}
