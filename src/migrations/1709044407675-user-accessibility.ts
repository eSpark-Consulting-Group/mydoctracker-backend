import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAccessibility1709044407675 implements MigrationInterface {
    name = 'UserAccessibility1709044407675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6dc1d75083045958311021fe9b\` ON \`subsidiary\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`accessibility\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`accessibility\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6dc1d75083045958311021fe9b\` ON \`subsidiary\` (\`admin\`)`);
    }

}
