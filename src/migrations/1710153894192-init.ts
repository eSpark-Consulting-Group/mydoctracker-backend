import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1710153894192 implements MigrationInterface {
    name = 'Init1710153894192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subsidiary\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`admin\` varchar(36) NULL, UNIQUE INDEX \`IDX_c0095d3056e64326206d69cdb6\` (\`createdBy\`, \`name\`), UNIQUE INDEX \`REL_6dc1d75083045958311021fe9b\` (\`admin\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`address\` varchar(255) NOT NULL, \`companyName\` varchar(255) NULL, \`profilePicture\` varchar(255) NULL, \`username\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`hashedPassword\` varchar(255) NOT NULL, \`contact\` varchar(20) NOT NULL, \`fileId\` varchar(255) NULL, \`reset_token\` text NULL, \`role\` enum ('SU', 'CU', 'BCU', 'ACU', 'RCU') NOT NULL DEFAULT 'SU', \`status\` enum ('ACTIVE', 'DEACTIVE') NOT NULL DEFAULT 'ACTIVE', \`accessibility\` json NULL, \`meta\` json NULL, \`subsidiary\` varchar(36) NULL, INDEX \`IDX_user_email\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_6c71f479b6fd0e0f7e1b8d855e\` (\`contact\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`meta\` json NULL, UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), UNIQUE INDEX \`IDX_5e568e001f9d1b91f67815c580\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_inventory\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`macAddress\` varchar(17) NOT NULL, \`lastActivity\` json NULL, \`addedById\` varchar(36) NULL, UNIQUE INDEX \`IDX_0c30b53db7789f4862c4233d79\` (\`macAddress\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` varchar(36) NOT NULL, \`tracker\` varchar(36) NOT NULL, \`type\` enum ('SINGLE', 'MULTIPLE') NOT NULL, \`title\` varchar(255) NOT NULL, \`creationDate\` datetime NOT NULL, \`file\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`idleStateInterval\` int NOT NULL DEFAULT '360', \`mobileStateInterval\` int NOT NULL DEFAULT '5', \`active\` tinyint NOT NULL DEFAULT 1, \`assignee\` varchar(36) NOT NULL, \`meta\` json NULL, UNIQUE INDEX \`REL_303b99e8c5d28a085b24980d66\` (\`tracker\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shared_location\` (\`id\` varchar(36) NOT NULL, \`public\` tinyint NOT NULL, \`users\` text NOT NULL, \`documentIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`request\` (\`id\` varchar(36) NOT NULL, \`meta\` json NULL, \`type\` enum ('DOC', 'SHARE') NOT NULL, \`createdBy\` varchar(36) NOT NULL, \`subsidiary\` varchar(36) NOT NULL, \`document\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_5b3005e0b4d450e076f6118d09\` (\`document\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reports\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`file\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otp\` (\`id\` varchar(36) NOT NULL, \`otp\` int NOT NULL, \`purpose\` enum ('add_document', 'change_password') NOT NULL, \`user\` varchar(36) NOT NULL, \`expiresAt\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`message\` varchar(255) NOT NULL, \`type\` enum ('SOS', 'GEOFENCE', 'BATTERY') NOT NULL, \`read\` tinyint NOT NULL, \`sentAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`documentIdId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`firmware\` (\`id\` varchar(36) NOT NULL, \`build\` text NOT NULL, \`version\` varchar(255) NOT NULL, \`timestamp\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`meta\` json NULL, UNIQUE INDEX \`IDX_fec3701f3d6b083c7e09283bb0\` (\`version\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_history\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('SINGLE', 'MULTIPLE') NOT NULL, \`title\` varchar(255) NOT NULL, \`creationDate\` datetime NOT NULL, \`file\` varchar(255) NOT NULL, \`meta\` json NULL, \`document\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_34de17391b722e815e1be9437d5\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` ADD CONSTRAINT \`FK_6dc1d75083045958311021fe9b6\` FOREIGN KEY (\`admin\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_71f5b5e7b9e72ff315199a5ad7e\` FOREIGN KEY (\`subsidiary\`) REFERENCES \`subsidiary\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` ADD CONSTRAINT \`FK_2c2480c4184ff0875f97051c546\` FOREIGN KEY (\`addedById\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_303b99e8c5d28a085b24980d660\` FOREIGN KEY (\`tracker\`) REFERENCES \`device_inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_b67d2d3c07b43afca2527b31f6c\` FOREIGN KEY (\`assignee\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shared_location\` ADD CONSTRAINT \`FK_653113908146f490fd593a4321c\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_714d69100c9c9f7835e3c2ef3e0\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_7595343a196aa3ba667d83bdb8c\` FOREIGN KEY (\`subsidiary\`) REFERENCES \`subsidiary\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request\` ADD CONSTRAINT \`FK_5b3005e0b4d450e076f6118d096\` FOREIGN KEY (\`document\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_bed415cd29716cd707e9cb3c09c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`otp\` ADD CONSTRAINT \`FK_d863a84e0f636c7224237aedffb\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_439775708a1d08352482496bf43\` FOREIGN KEY (\`documentIdId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_history\` ADD CONSTRAINT \`FK_42132cfe977ffe1ecd2d1580a35\` FOREIGN KEY (\`document\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_history\` DROP FOREIGN KEY \`FK_42132cfe977ffe1ecd2d1580a35\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_439775708a1d08352482496bf43\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`otp\` DROP FOREIGN KEY \`FK_d863a84e0f636c7224237aedffb\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_bed415cd29716cd707e9cb3c09c\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_5b3005e0b4d450e076f6118d096\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_7595343a196aa3ba667d83bdb8c\``);
        await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_714d69100c9c9f7835e3c2ef3e0\``);
        await queryRunner.query(`ALTER TABLE \`shared_location\` DROP FOREIGN KEY \`FK_653113908146f490fd593a4321c\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_b67d2d3c07b43afca2527b31f6c\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_303b99e8c5d28a085b24980d660\``);
        await queryRunner.query(`ALTER TABLE \`device_inventory\` DROP FOREIGN KEY \`FK_2c2480c4184ff0875f97051c546\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_71f5b5e7b9e72ff315199a5ad7e\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_6dc1d75083045958311021fe9b6\``);
        await queryRunner.query(`ALTER TABLE \`subsidiary\` DROP FOREIGN KEY \`FK_34de17391b722e815e1be9437d5\``);
        await queryRunner.query(`DROP TABLE \`document_history\``);
        await queryRunner.query(`DROP INDEX \`IDX_fec3701f3d6b083c7e09283bb0\` ON \`firmware\``);
        await queryRunner.query(`DROP TABLE \`firmware\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`otp\``);
        await queryRunner.query(`DROP TABLE \`reports\``);
        await queryRunner.query(`DROP INDEX \`REL_5b3005e0b4d450e076f6118d09\` ON \`request\``);
        await queryRunner.query(`DROP TABLE \`request\``);
        await queryRunner.query(`DROP TABLE \`shared_location\``);
        await queryRunner.query(`DROP INDEX \`REL_303b99e8c5d28a085b24980d66\` ON \`document\``);
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
        await queryRunner.query(`DROP INDEX \`REL_6dc1d75083045958311021fe9b\` ON \`subsidiary\``);
        await queryRunner.query(`DROP INDEX \`IDX_c0095d3056e64326206d69cdb6\` ON \`subsidiary\``);
        await queryRunner.query(`DROP TABLE \`subsidiary\``);
    }

}
