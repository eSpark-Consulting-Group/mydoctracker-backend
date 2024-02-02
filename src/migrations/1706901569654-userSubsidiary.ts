import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSubsidiary1706901569654 implements MigrationInterface {
    name = 'UserSubsidiary1706901569654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_c067fbabf0b805af3498ea3fd92\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` CHANGE \`user\` \`createdBy\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`subsidiary\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_34de17391b722e815e1be9437d5\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_71f5b5e7b9e72ff315199a5ad7e\` FOREIGN KEY (\`subsidiary\`) REFERENCES \`subsidiary\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_71f5b5e7b9e72ff315199a5ad7e\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_34de17391b722e815e1be9437d5\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`subsidiary\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` CHANGE \`createdBy\` \`user\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_c067fbabf0b805af3498ea3fd92\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
