import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentEnum1705932296567 implements MigrationInterface {
    name = 'DocumentEnum1705932296567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`idleStateInterval\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`idleStateInterval\` int NOT NULL DEFAULT '360'`);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`mobileStateInterval\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`mobileStateInterval\` int NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`mobileStateInterval\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`mobileStateInterval\` varchar(255) NOT NULL DEFAULT '5m'`);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`idleStateInterval\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`idleStateInterval\` varchar(255) NOT NULL DEFAULT '6hr'`);
    }

}
