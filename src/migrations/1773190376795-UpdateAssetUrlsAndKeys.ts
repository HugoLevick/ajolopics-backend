import { MigrationInterface, QueryRunner } from 'typeorm';

let hostUrl = process.env.HOST || 'http://localhost';
hostUrl += process.env.PORT ? `:${process.env.PORT}` : '';

export class UpdateAssetUrlsAndKeys1773190376795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            UPDATE media_variants mv
            SET
                url = CONCAT('${hostUrl}/assets/', a.id, '/', mv.variant),
                key = SUBSTRING(mv.key, 9)
            FROM assets a
            WHERE mv."assetId" = a.id;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            UPDATE media_variants mv
            SET
                url = CONCAT('${hostUrl}/${process.env.UPLOAD_DIR}/', mv.key),
                key = CONCAT('uploads/', mv.key)
            FROM assets a
            WHERE mv."assetId" = a.id;
        `);
  }
}
