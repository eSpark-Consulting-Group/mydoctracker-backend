import { MigrationInterface, QueryRunner } from "typeorm";

export class BatteryAlert1710423326627 implements MigrationInterface {
    name = 'BatteryAlert1710423326627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD \`notificationFlag\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP COLUMN \`notificationFlag\``);
    }

}
