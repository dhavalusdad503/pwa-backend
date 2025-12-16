import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765559980391 implements MigrationInterface {
  name = 'Migration1765559980391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "slug" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "UQ_881f72bac969d9a00a1a29e1079" UNIQUE ("slug"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_auth_provider_enum" AS ENUM('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB', 'TWITTER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "phone" character varying(20), "password" character varying NOT NULL, "role_id" uuid NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "auth_provider" "public"."users_auth_provider_enum" NOT NULL DEFAULT 'EMAIL', "reset_pass_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "org_id" uuid NOT NULL, "name" character varying, "primary_address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "org_users" ("user_id" uuid NOT NULL, "org_id" uuid NOT NULL, CONSTRAINT "PK_1e06ead3f9dca34638f3861fae4" PRIMARY KEY ("user_id", "org_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "visits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "org_id" uuid NOT NULL, "caregiver_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "started_at" TIMESTAMP NOT NULL, "ended_at" TIMESTAMP NOT NULL, "submitted_at" TIMESTAMP, "service_type" character varying(100) NOT NULL, "notes" text NOT NULL, "latitude" numeric(10,8), "longitude" numeric(10,8), "attestation" boolean NOT NULL, "attestation_name" character varying NOT NULL, "client_present" boolean NOT NULL, "follow_up" boolean NOT NULL, "medication_reviewed" boolean NOT NULL, "safety_check" boolean NOT NULL, CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_888544af4e3f2f6607edc5c334" ON "org_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91bdfbf80cce12792eebd7979e" ON "org_users" ("org_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_dc4f223468434740e2e529076f2" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_888544af4e3f2f6607edc5c334e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" ADD CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_21ec2079cd17825d1df52356f34" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_81ace3b37c7d880f656fe2e0ee0" FOREIGN KEY ("caregiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_5054db93135a6d966fd3939caa6" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_5054db93135a6d966fd3939caa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_81ace3b37c7d880f656fe2e0ee0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_21ec2079cd17825d1df52356f34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_91bdfbf80cce12792eebd7979e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "org_users" DROP CONSTRAINT "FK_888544af4e3f2f6607edc5c334e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_dc4f223468434740e2e529076f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91bdfbf80cce12792eebd7979e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_888544af4e3f2f6607edc5c334"`,
    );
    await queryRunner.query(`DROP TABLE "visits"`);
    await queryRunner.query(`DROP TABLE "org_users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "patients"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_auth_provider_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
