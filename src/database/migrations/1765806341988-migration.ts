import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765806341988 implements MigrationInterface {
  name = 'Migration1765806341988';

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
    await queryRunner.query(
      `ALTER TABLE "visits" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "visits" ADD "deleted_at" TIMESTAMP`);
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
    await queryRunner.query(`ALTER TABLE "visits" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "visits" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "visits" DROP COLUMN "created_at"`);
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
