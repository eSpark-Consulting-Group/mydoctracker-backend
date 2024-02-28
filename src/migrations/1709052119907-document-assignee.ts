import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentAssignee1709052119907 implements MigrationInterface {
    name = 'DocumentAssignee1709052119907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_b67d2d3c07b43afca2527b31f6c\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`assignee\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`isDeleted\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`assigneeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_3276fba98eb70db5fd41ec98a41\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_3276fba98eb70db5fd41ec98a41\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`assigneeId\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`assignee\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_b67d2d3c07b43afca2527b31f6c\` FOREIGN KEY (\`assignee\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
