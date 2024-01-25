import { MigrationInterface, QueryRunner } from "typeorm";

export class DocHistory1706202891373 implements MigrationInterface {
    name = 'DocHistory1706202891373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP FOREIGN KEY \`FK_474bb2f25e1319db63702300abc\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP COLUMN \`documentIdId\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD \`documentId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD CONSTRAINT \`FK_4a9486398505240b92812660f7f\` FOREIGN KEY (\`documentId\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP FOREIGN KEY \`FK_4a9486398505240b92812660f7f\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP COLUMN \`documentId\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD \`documentIdId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD CONSTRAINT \`FK_474bb2f25e1319db63702300abc\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
