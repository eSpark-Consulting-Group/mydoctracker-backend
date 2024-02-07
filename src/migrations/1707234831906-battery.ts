import { MigrationInterface, QueryRunner } from "typeorm";

export class Battery1707234831906 implements MigrationInterface {
    name = 'Battery1707234831906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD \`batteryPercentage\` decimal NOT NULL DEFAULT '100'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP COLUMN \`batteryPercentage\``);
    }

}
