import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyChanges1708025587982 implements MigrationInterface {
    name = 'CompanyChanges1708025587982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_66339e402b71b3193d3e99a85d2\``);
        await queryRunner.query(`ALTER TABLE \`company\` ADD UNIQUE INDEX \`IDX_66339e402b71b3193d3e99a85d\` (\`user\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_66339e402b71b3193d3e99a85d\` ON \`company\` (\`user\`)`);
        await queryRunner.query(`ALTER TABLE \`company\` ADD CONSTRAINT \`FK_66339e402b71b3193d3e99a85d2\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_66339e402b71b3193d3e99a85d2\``);
        await queryRunner.query(`DROP INDEX \`REL_66339e402b71b3193d3e99a85d\` ON \`company\``);
        await queryRunner.query(`ALTER TABLE \`company\` DROP INDEX \`IDX_66339e402b71b3193d3e99a85d\``);
        await queryRunner.query(`ALTER TABLE \`company\` ADD CONSTRAINT \`FK_66339e402b71b3193d3e99a85d2\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
