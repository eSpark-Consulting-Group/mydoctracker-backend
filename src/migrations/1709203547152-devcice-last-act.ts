import { MigrationInterface, QueryRunner } from "typeorm";

export class DevciceLastAct1709203547152 implements MigrationInterface {
    name = 'DevciceLastAct1709203547152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` CHANGE \`batteryPercentage\` \`lastActivity\` decimal NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP COLUMN \`lastActivity\``);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD \`lastActivity\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP COLUMN \`lastActivity\``);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD \`lastActivity\` decimal NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` CHANGE \`lastActivity\` \`batteryPercentage\` decimal NOT NULL DEFAULT '100'`);
    }

}
