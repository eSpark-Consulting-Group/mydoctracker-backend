import { MigrationInterface, QueryRunner } from "typeorm";

export class UserChange1708510539992 implements MigrationInterface {
    name = 'UserChange1708510539992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_0eed2a5118ae3daca7b1bf9d4dd\``);
        await queryRunner.query(`DROP INDEX \`IDX_65cc26c82671f0c39bd4b665c0\` ON \`subsidiary\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP COLUMN \`company\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`companyName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`firstName\` \`firstName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastName\` \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c0095d3056e64326206d69cdb6\` ON \`subsidiary\` (\`createdBy\`, \`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c0095d3056e64326206d69cdb6\` ON \`subsidiary\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastName\` \`lastName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`firstName\` \`firstName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`companyName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD \`company\` varchar(36) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_65cc26c82671f0c39bd4b665c0\` ON \`subsidiary\` (\`company\`, \`name\`)`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_0eed2a5118ae3daca7b1bf9d4dd\` FOREIGN KEY (\`company\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
