import { MigrationInterface, QueryRunner } from "typeorm";

export class FielID1704457963096 implements MigrationInterface {
    name = 'FielID1704457963096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`fileId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fileId\``);
    }

}
