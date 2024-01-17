import { MigrationInterface, QueryRunner } from "typeorm";

export class IntervalDefautlt1705522687211 implements MigrationInterface {
    name = 'IntervalDefautlt1705522687211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`idleStateInterval\` \`idleStateInterval\` varchar(255) NOT NULL DEFAULT '6hr'`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`mobileStateInterval\` \`mobileStateInterval\` varchar(255) NOT NULL DEFAULT '5m'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`mobileStateInterval\` \`mobileStateInterval\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`idleStateInterval\` \`idleStateInterval\` varchar(255) NOT NULL`);
    }

}
