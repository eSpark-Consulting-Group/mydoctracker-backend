import { MigrationInterface, QueryRunner } from "typeorm";

export class Request1707998672794 implements MigrationInterface {
    name = 'Request1707998672794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`request\` (\`id\` varchar(36) NOT NULL, \`meta\` json NULL, \`type\` enum ('DOC', 'SHARE') NOT NULL, \`documentId\` varchar(255) NOT NULL, \`status\` enum ('APPROVED', 'REJECTED', 'PENDING') NOT NULL DEFAULT 'PENDING', \`createdBy\` varchar(36) NOT NULL, \`attendedBy\` varchar(36) NULL, \`subsidiary\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_36e602053ab9ad5e4c4639a869\` (\`documentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_714d69100c9c9f7835e3c2ef3e0\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_a0ba4b923dc1e750143a2dd928e\` FOREIGN KEY (\`attendedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_7595343a196aa3ba667d83bdb8c\` FOREIGN KEY (\`subsidiary\`) REFERENCES \`subsidiary\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_36e602053ab9ad5e4c4639a8694\` FOREIGN KEY (\`documentId\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_36e602053ab9ad5e4c4639a8694\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_7595343a196aa3ba667d83bdb8c\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_a0ba4b923dc1e750143a2dd928e\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_714d69100c9c9f7835e3c2ef3e0\``);
        await queryRunner.query(`DROP INDEX \`REL_36e602053ab9ad5e4c4639a869\` ON \`request\``);
        await queryRunner.query(`DROP TABLE \`request\``);
    }

}
