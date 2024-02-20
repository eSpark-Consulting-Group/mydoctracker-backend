import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestStatusChange1708370212935 implements MigrationInterface {
    name = 'RequestStatusChange1708370212935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_66339e402b71b3193d3e99a85d\` ON \`company\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP COLUMN \`status\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` ADD \`status\` enum ('APPROVED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_66339e402b71b3193d3e99a85d\` ON \`company\` (\`user\`)`);
    }

}
