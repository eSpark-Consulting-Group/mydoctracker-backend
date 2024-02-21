import { MigrationInterface, QueryRunner } from "typeorm";

export class SubsidiaryAdmin1708530457766 implements MigrationInterface {
    name = 'SubsidiaryAdmin1708530457766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_6dc1d75083045958311021fe9b6\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD UNIQUE INDEX \`IDX_6dc1d75083045958311021fe9b\` (\`admin\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6dc1d75083045958311021fe9b\` ON \`subsidiary\` (\`admin\`)`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_6dc1d75083045958311021fe9b6\` FOREIGN KEY (\`admin\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_6dc1d75083045958311021fe9b6\``);
        await queryRunner.query(`DROP INDEX \`REL_6dc1d75083045958311021fe9b\` ON \`subsidiary\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP INDEX \`IDX_6dc1d75083045958311021fe9b\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_6dc1d75083045958311021fe9b6\` FOREIGN KEY (\`admin\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
