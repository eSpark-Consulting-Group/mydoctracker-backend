import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteDoc1705533672216 implements MigrationInterface {
    name = 'DeleteDoc1705533672216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`isDeleted\``);
    }

}
