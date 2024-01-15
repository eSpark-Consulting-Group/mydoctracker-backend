import { MigrationInterface, QueryRunner } from "typeorm";

export class MetaNull1704710556938 implements MigrationInterface {
    name = 'MetaNull1704710556938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`meta\` \`meta\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`meta\` \`meta\` json NOT NULL`);
    }

}
