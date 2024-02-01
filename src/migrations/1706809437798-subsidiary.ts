import { MigrationInterface, QueryRunner } from "typeorm";

export class Subsidiary1706809437798 implements MigrationInterface {
    name = 'Subsidiary1706809437798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`contact\` varchar(20) NOT NULL, \`user\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_b0fc567cf51b1cf717a9e8046a\` (\`email\`), UNIQUE INDEX \`IDX_b898bab85587799452c67d9158\` (\`contact\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subsidiary\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`company\` varchar(36) NOT NULL, \`user\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_65cc26c82671f0c39bd4b665c0\` (\`company\`, \`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`company\` ADD CONSTRAINT \`FK_66339e402b71b3193d3e99a85d2\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_0eed2a5118ae3daca7b1bf9d4dd\` FOREIGN KEY (\`company\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_c067fbabf0b805af3498ea3fd92\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_c067fbabf0b805af3498ea3fd92\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_0eed2a5118ae3daca7b1bf9d4dd\``);
        await queryRunner.query(`ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_66339e402b71b3193d3e99a85d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_65cc26c82671f0c39bd4b665c0\` ON \`subsidiary\``);
        await queryRunner.query(`DROP TABLE \`subsidiary\``);
        await queryRunner.query(`DROP INDEX \`IDX_b898bab85587799452c67d9158\` ON \`company\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0fc567cf51b1cf717a9e8046a\` ON \`company\``);
        await queryRunner.query(`DROP TABLE \`company\``);
    }

}
