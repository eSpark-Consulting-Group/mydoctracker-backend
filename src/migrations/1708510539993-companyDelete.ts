import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyDelete1708510539993 implements MigrationInterface {
  name = 'CompanyDelete1708510539993';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`company\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
