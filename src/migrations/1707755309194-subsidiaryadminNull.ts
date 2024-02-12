import { MigrationInterface, QueryRunner } from "typeorm";

export class SubsidiaryadminNull1707755309194 implements MigrationInterface {
    name = 'SubsidiaryadminNull1707755309194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_6dc1d75083045958311021fe9b6\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_6dc1d75083045958311021fe9b6\` FOREIGN KEY (\`admin\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_6dc1d75083045958311021fe9b6\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_6dc1d75083045958311021fe9b6\` FOREIGN KEY (\`admin\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
