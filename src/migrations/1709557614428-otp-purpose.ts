import { MigrationInterface, QueryRunner } from "typeorm";

export class OtpPurpose1709557614428 implements MigrationInterface {
    name = 'OtpPurpose1709557614428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otp\` CHANGE \`purpose\` \`purpose\` enum ('add_document', 'change_password') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otp\` CHANGE \`purpose\` \`purpose\` enum ('add_document') NOT NULL`);
    }

}
