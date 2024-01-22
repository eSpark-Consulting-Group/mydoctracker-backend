import { MigrationInterface, QueryRunner } from "typeorm";

export class Firmware1705934388679 implements MigrationInterface {
    name = 'Firmware1705934388679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`firmware\` (\`id\` varchar(36) NOT NULL, \`build\` text NOT NULL, \`version\` varchar(255) NOT NULL, \`meta\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`firmware\``);
    }

}
