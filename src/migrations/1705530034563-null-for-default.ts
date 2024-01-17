import { MigrationInterface, QueryRunner } from "typeorm";

export class NullForDefault1705530034563 implements MigrationInterface {
    name = 'NullForDefault1705530034563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_261aec0a1d9e9ff070825fba07\` ON \`document\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`active\` \`active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`active\` \`active\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_261aec0a1d9e9ff070825fba07\` ON \`document\` (\`trackerId\`)`);
    }

}
