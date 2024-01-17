import { MigrationInterface, QueryRunner } from "typeorm";

export class MetaNull1705522855321 implements MigrationInterface {
    name = 'MetaNull1705522855321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`meta\` \`meta\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`meta\` \`meta\` json NOT NULL`);
    }

}
