import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagEntity1772319599994 implements MigrationInterface {
    name = 'AddTagEntity1772319599994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tag_name" ON "tags" ("name") `);
        await queryRunner.query(`CREATE TABLE "post_tags" ("postId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_ba869415ada9d211d8af980499f" PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_76e701b89d9bba541e1543adfa" ON "post_tags" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86fabcae8483f7cc4fbd36cf6a" ON "post_tags" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "post_tags" ADD CONSTRAINT "FK_post_tags_post_id" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tags" ADD CONSTRAINT "FK_post_tags_tag_id" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_tag_id"`);
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_post_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86fabcae8483f7cc4fbd36cf6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76e701b89d9bba541e1543adfa"`);
        await queryRunner.query(`DROP TABLE "post_tags"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_tag_name"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
