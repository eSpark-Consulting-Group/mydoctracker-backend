import { MigrationInterface, QueryRunner } from "typeorm";

export class Firmware1706006181943 implements MigrationInterface {
    name = 'Firmware1706006181943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`firmware\` (\`id\` varchar(36) NOT NULL, \`build\` text NOT NULL, \`version\` varchar(255) NOT NULL, \`timestamp\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`meta\` json NULL, UNIQUE INDEX \`IDX_fec3701f3d6b083c7e09283bb0\` (\`version\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fec3701f3d6b083c7e09283bb0\` ON \`firmware\``);
        await queryRunner.query(`DROP TABLE \`firmware\``);
    }

}
