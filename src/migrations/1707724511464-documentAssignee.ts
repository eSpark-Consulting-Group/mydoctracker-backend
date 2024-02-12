import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentAssignee1707724511464 implements MigrationInterface {
    name = 'DocumentAssignee1707724511464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_3276fba98eb70db5fd41ec98a41\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`assigneeId\` \`assignee\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`assignee\` \`assignee\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_b67d2d3c07b43afca2527b31f6c\` FOREIGN KEY (\`assignee\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_b67d2d3c07b43afca2527b31f6c\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`assignee\` \`assignee\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`assignee\` \`assigneeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_3276fba98eb70db5fd41ec98a41\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
