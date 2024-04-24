import { MigrationInterface, QueryRunner } from 'typeorm';

export class GamesCreate1713973906917 implements MigrationInterface {
  name = 'GamesCreate1713973906917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`games\` (\`id\` int NOT NULL AUTO_INCREMENT, \`category_id\` int NULL, \`name\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`games\``);
  }
}
