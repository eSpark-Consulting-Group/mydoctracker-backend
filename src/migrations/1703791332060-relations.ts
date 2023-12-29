import { MigrationInterface, QueryRunner } from "typeorm";

export class Relations1703791332060 implements MigrationInterface {
    name = 'Relations1703791332060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_86586021a26d1180b0968f9850\` (\`companyId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_86586021a26d1180b0968f9850\` ON \`user\` (\`companyId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_86586021a26d1180b0968f98502\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_86586021a26d1180b0968f98502\``);
        await queryRunner.query(`DROP INDEX \`REL_86586021a26d1180b0968f9850\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_86586021a26d1180b0968f9850\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`companyId\``);
    }

}
