import { MigrationInterface, QueryRunner } from "typeorm";

export class TrackerId1705524583042 implements MigrationInterface {
    name = 'TrackerId1705524583042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_303b99e8c5d28a085b24980d660\``);
        await queryRunner.query(`DROP INDEX \`IDX_303b99e8c5d28a085b24980d66\` ON \`document\``);
        await queryRunner.query(`DROP INDEX \`REL_303b99e8c5d28a085b24980d66\` ON \`document\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`tracker\` \`trackerId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD UNIQUE INDEX \`IDX_261aec0a1d9e9ff070825fba07\` (\`trackerId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_261aec0a1d9e9ff070825fba07\` ON \`document\` (\`trackerId\`)`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_261aec0a1d9e9ff070825fba079\` FOREIGN KEY (\`trackerId\`) REFERENCES \`device_inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_261aec0a1d9e9ff070825fba079\``);
        await queryRunner.query(`DROP INDEX \`REL_261aec0a1d9e9ff070825fba07\` ON \`document\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP INDEX \`IDX_261aec0a1d9e9ff070825fba07\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`trackerId\` \`tracker\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_303b99e8c5d28a085b24980d66\` ON \`document\` (\`tracker\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_303b99e8c5d28a085b24980d66\` ON \`document\` (\`tracker\`)`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_303b99e8c5d28a085b24980d660\` FOREIGN KEY (\`tracker\`) REFERENCES \`device_inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
