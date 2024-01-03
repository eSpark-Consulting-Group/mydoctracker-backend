import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueContact1704299951972 implements MigrationInterface {
    name = 'UniqueContact1704299951972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_6c71f479b6fd0e0f7e1b8d855e\` (\`contact\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_6c71f479b6fd0e0f7e1b8d855e\``);
    }

}
