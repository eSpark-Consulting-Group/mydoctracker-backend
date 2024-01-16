import { MigrationInterface, QueryRunner } from "typeorm";

export class Meta1704474526673 implements MigrationInterface {
    name = 'Meta1704474526673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`reset_token\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`meta\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`meta\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`reset_token\``);
    }

}
