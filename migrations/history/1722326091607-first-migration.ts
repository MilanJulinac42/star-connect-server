import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1722326091607 implements MigrationInterface {
    name = 'FirstMigration1722326091607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Talent" ("id" SERIAL NOT NULL, "pricePerVideo" numeric(10,2) NOT NULL, "turnaroundTime" smallint NOT NULL, "categories" text, "userId" integer, CONSTRAINT "REL_2594eb735413ff690a0208bf69" UNIQUE ("userId"), CONSTRAINT "PK_4ac7a6efe181077d256f3dffa19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "username" character varying NOT NULL, "profilePicture" character varying, "biography" text, "isTalent" boolean NOT NULL DEFAULT false, "talentId" integer, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "UQ_29a05908a0fa0728526d2833657" UNIQUE ("username"), CONSTRAINT "REL_f6711a77bff46f09afc5239e40" UNIQUE ("talentId"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."VideoRequest_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "VideoRequest" ("id" SERIAL NOT NULL, "instructions" text NOT NULL, "recipientName" character varying NOT NULL, "occasion" character varying NOT NULL, "status" "public"."VideoRequest_status_enum" NOT NULL DEFAULT 'pending', "videoFile" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" integer, "talent_id" integer, CONSTRAINT "PK_c6919365f57975bcdf8eeee9754" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Talent" ADD CONSTRAINT "FK_2594eb735413ff690a0208bf697" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_f6711a77bff46f09afc5239e400" FOREIGN KEY ("talentId") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VideoRequest" ADD CONSTRAINT "FK_5b29dd82a7801c6c812851d2825" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VideoRequest" ADD CONSTRAINT "FK_33c91a44a3f982411fa60f4b613" FOREIGN KEY ("talent_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "VideoRequest" DROP CONSTRAINT "FK_33c91a44a3f982411fa60f4b613"`);
        await queryRunner.query(`ALTER TABLE "VideoRequest" DROP CONSTRAINT "FK_5b29dd82a7801c6c812851d2825"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_f6711a77bff46f09afc5239e400"`);
        await queryRunner.query(`ALTER TABLE "Talent" DROP CONSTRAINT "FK_2594eb735413ff690a0208bf697"`);
        await queryRunner.query(`DROP TABLE "VideoRequest"`);
        await queryRunner.query(`DROP TYPE "public"."VideoRequest_status_enum"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Talent"`);
    }

}
