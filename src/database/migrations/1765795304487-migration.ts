import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765795304487 implements MigrationInterface {
  name = 'Migration1765795304487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_888544af4e3f2f6607edc5c334e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_888544af4e3f2f6607edc5c334"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91bdfbf80cce12792eebd7979e"`,
    );
    await queryRunner.query(`ALTER TABLE "visits" ADD "address" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "submitted_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "notes" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "client_present" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "client_present" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "follow_up" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "follow_up" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "medication_reviewed" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "medication_reviewed" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "safety_check" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "safety_check" SET DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_888544af4e3f2f6607edc5c334" ON "org_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91bdfbf80cce12792eebd7979e" ON "org_users" ("org_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_888544af4e3f2f6607edc5c334e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_888544af4e3f2f6607edc5c334e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91bdfbf80cce12792eebd7979e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_888544af4e3f2f6607edc5c334"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "safety_check" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "safety_check" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "medication_reviewed" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "medication_reviewed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "follow_up" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "follow_up" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "client_present" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "client_present" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "notes" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "submitted_at" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "visits" DROP COLUMN "address"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_91bdfbf80cce12792eebd7979e" ON "org_users" ("org_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_888544af4e3f2f6607edc5c334" ON "org_users" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_888544af4e3f2f6607edc5c334e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
