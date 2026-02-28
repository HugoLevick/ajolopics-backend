import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratePostAndAssetsEntities1772248612984 implements MigrationInterface {
    name = 'GeneratePostAndAssetsEntities1772248612984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."media_variants_variant_enum" AS ENUM('ORIGINAL', 'MEDIUM', 'THUMBNAIL')`);
        await queryRunner.query(`CREATE TABLE "media_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(511) NOT NULL, "key" character varying(511) NOT NULL, "variant" "public"."media_variants_variant_enum" NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "size" bigint NOT NULL, "mimeType" character varying(255) NOT NULL, "assetId" uuid, CONSTRAINT "PK_3c1e58945b13642f502cc720a34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying(255) NOT NULL, "position" smallint NOT NULL DEFAULT '0', "postId" uuid, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_uq_asset_post_position" ON "assets" ("postId", "position") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "media_variants" ADD CONSTRAINT "FK_media_variant_asset" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_asset_post" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_asset_post"`);
        await queryRunner.query(`ALTER TABLE "media_variants" DROP CONSTRAINT "FK_media_variant_asset"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "public"."idx_uq_asset_post_position"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "media_variants"`);
        await queryRunner.query(`DROP TYPE "public"."media_variants_variant_enum"`);
    }

}
