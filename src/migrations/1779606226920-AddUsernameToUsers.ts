import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUsers1779606226920 implements MigrationInterface {
    name = 'AddUsernameToUsers1779606226920'

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying(15)`,
    );

    await queryRunner.query(`
      DO $$
      DECLARE
        user_record RECORD;
        base_username text;
        candidate text;
        suffix text;
        suffix_index integer;
      BEGIN
        FOR user_record IN SELECT "id", "name" FROM "users" ORDER BY "id" LOOP
          base_username := lower(trim(user_record."name"));
          base_username := regexp_replace(base_username, '\\s+', '.', 'g');
          base_username := regexp_replace(base_username, '[^a-z0-9_.]', '', 'g');
          base_username := regexp_replace(base_username, '\\.+', '.', 'g');
          base_username := btrim(base_username, '.');
          base_username := left(base_username, 15);
          base_username := btrim(base_username, '.');

          IF length(base_username) < 3 THEN
            base_username := 'user';
          END IF;

          candidate := base_username;
          suffix_index := 1;

          WHILE EXISTS (
            SELECT 1 FROM "users" WHERE "username" = candidate
          ) LOOP
            suffix_index := suffix_index + 1;
            suffix := '.' || suffix_index::text;
            candidate := left(base_username, 15 - length(suffix)) || suffix;
          END LOOP;

          UPDATE "users"
          SET "username" = candidate
          WHERE "id" = user_record."id";
        END LOOP;
      END $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_username" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_users_username"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }

}
