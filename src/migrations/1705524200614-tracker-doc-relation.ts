import { MigrationInterface, QueryRunner } from "typeorm";

export class TrackerDocRelation1705524200614 implements MigrationInterface {
    name = 'TrackerDocRelation1705524200614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`trackerIdId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD UNIQUE INDEX \`IDX_d6b04589f586f0c93b6747a388\` (\`trackerIdId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_d6b04589f586f0c93b6747a388\` ON \`document\` (\`trackerIdId\`)`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_d6b04589f586f0c93b6747a388b\` FOREIGN KEY (\`trackerIdId\`) REFERENCES \`device_inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_d6b04589f586f0c93b6747a388b\``);
        await queryRunner.query(`DROP INDEX \`REL_d6b04589f586f0c93b6747a388\` ON \`document\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP INDEX \`IDX_d6b04589f586f0c93b6747a388\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`trackerIdId\``);
    }

}
