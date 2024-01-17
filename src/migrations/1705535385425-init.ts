import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1705535385425 implements MigrationInterface {
    name = 'Init1705535385425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`profilePicture\` varchar(255) NULL, \`username\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`employeePassword\` varchar(255) NULL, \`hashedPassword\` varchar(255) NOT NULL, \`contact\` varchar(20) NOT NULL, \`fileId\` varchar(255) NULL, \`reset_token\` text NULL, \`role\` enum ('SU', 'CU', 'BCU', 'ACU', 'RCU') NOT NULL DEFAULT 'SU', \`status\` enum ('ACTIVE', 'DEACTIVE') NOT NULL DEFAULT 'ACTIVE', \`meta\` json NULL, INDEX \`IDX_user_email\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_6c71f479b6fd0e0f7e1b8d855e\` (\`contact\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`meta\` json NULL, UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), UNIQUE INDEX \`IDX_5e568e001f9d1b91f67815c580\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_inventory\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`macAddress\` varchar(17) NOT NULL, \`addedById\` varchar(36) NULL, UNIQUE INDEX \`IDX_0c30b53db7789f4862c4233d79\` (\`macAddress\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('SINGLE', 'MULTIPLE') NOT NULL, \`title\` varchar(255) NOT NULL, \`creationDate\` datetime NOT NULL, \`file\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`idleStateInterval\` varchar(255) NOT NULL DEFAULT '6hr', \`mobileStateInterval\` varchar(255) NOT NULL DEFAULT '5m', \`active\` tinyint NOT NULL DEFAULT 1, \`meta\` json NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`trackerId\` varchar(36) NULL, \`assigneeId\` varchar(36) NULL, UNIQUE INDEX \`REL_261aec0a1d9e9ff070825fba07\` (\`trackerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shared_location\` (\`id\` varchar(36) NOT NULL, \`public\` tinyint NOT NULL, \`users\` text NOT NULL, \`documentIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_history\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('SINGLE', 'MULTIPLE') NOT NULL, \`title\` varchar(255) NOT NULL, \`creationDate\` datetime NOT NULL, \`file\` varchar(255) NOT NULL, \`meta\` json NULL, \`documentIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reports\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`file\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`message\` varchar(255) NOT NULL, \`type\` enum ('SOS', 'GEOFENCE', 'BATTERY') NOT NULL, \`read\` tinyint NOT NULL, \`sentAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`documentIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD CONSTRAINT \`FK_2c2480c4184ff0875f97051c546\` FOREIGN KEY (\`addedById\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_261aec0a1d9e9ff070825fba079\` FOREIGN KEY (\`trackerId\`) REFERENCES \`device_inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_3276fba98eb70db5fd41ec98a41\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shared_location\` ADD CONSTRAINT \`FK_653113908146f490fd593a4321c\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD CONSTRAINT \`FK_474bb2f25e1319db63702300abc\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_bed415cd29716cd707e9cb3c09c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_439775708a1d08352482496bf43\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_439775708a1d08352482496bf43\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_bed415cd29716cd707e9cb3c09c\``);
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP FOREIGN KEY \`FK_474bb2f25e1319db63702300abc\``);
        await queryRunner.query(`ALTER TABLE \`shared_location\` DROP FOREIGN KEY \`FK_653113908146f490fd593a4321c\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_3276fba98eb70db5fd41ec98a41\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_261aec0a1d9e9ff070825fba079\``);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP FOREIGN KEY \`FK_2c2480c4184ff0875f97051c546\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`reports\``);
        await queryRunner.query(`DROP TABLE \`document_history\``);
        await queryRunner.query(`DROP TABLE \`shared_location\``);
        await queryRunner.query(`DROP INDEX \`REL_261aec0a1d9e9ff070825fba07\` ON \`document\``);
        await queryRunner.query(`DROP TABLE \`document\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c30b53db7789f4862c4233d79\` ON \`device_inventory\``);
        await queryRunner.query(`DROP TABLE \`device_inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e568e001f9d1b91f67815c580\` ON \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c71f479b6fd0e0f7e1b8d855e\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
