import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndCompany1703788281257 implements MigrationInterface {
    name = 'UserAndCompany1703788281257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`contact\` varchar(255) NOT NULL, INDEX \`IDX_user_email\` (\`email\`), UNIQUE INDEX \`IDX_b0fc567cf51b1cf717a9e8046a\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`contact\` varchar(255) NOT NULL, \`role\` enum ('COPORATE', 'USER', 'EMPLOYEE') NOT NULL, \`roleType\` enum ('BASIC', 'DEFAULT', 'ADMIN') NULL, INDEX \`IDX_user_email\` (\`email\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0fc567cf51b1cf717a9e8046a\` ON \`company\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`company\``);
        await queryRunner.query(`DROP TABLE \`company\``);
    }

}
