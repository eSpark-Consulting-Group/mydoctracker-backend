import { MigrationInterface, QueryRunner } from "typeorm";

export class NullChecks1704283584548 implements MigrationInterface {
    name = 'NullChecks1704283584548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`employeePassword\` \`employeePassword\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`employeePassword\` \`employeePassword\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profilePicture\` \`profilePicture\` varchar(255) NOT NULL`);
    }

}
