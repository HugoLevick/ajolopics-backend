import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntitiesForTags1772325248091 implements MigrationInterface {
  name = 'UpdateEntitiesForTags1772325248091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "media_variants"`);
    await queryRunner.query(`DELETE FROM "assets"`);
    await queryRunner.query(`DELETE FROM "posts"`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "authorId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_posts_author_id" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_author_id"`,
    );
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "authorId"`);
  }
}
