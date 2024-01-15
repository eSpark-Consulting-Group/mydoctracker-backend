import { MigrationInterface, QueryRunner } from "typeorm";

export class MetaNull1705337087562 implements MigrationInterface {
    name = 'MetaNull1705337087562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`meta\` \`meta\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`meta\` \`meta\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin\` CHANGE \`meta\` \`meta\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`meta\` \`meta\` json NOT NULL`);
    }

}
