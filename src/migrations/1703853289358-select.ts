import { MigrationInterface, QueryRunner } from "typeorm";

export class Select1703853289358 implements MigrationInterface {
    name = 'Select1703853289358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_86586021a26d1180b0968f9850\` ON \`user\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_86586021a26d1180b0968f9850\` ON \`user\` (\`companyId\`)`);
    }

}
