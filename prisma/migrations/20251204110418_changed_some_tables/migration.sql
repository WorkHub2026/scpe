/*
  Warnings:

  - The values [Reviewer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `content` on the `Crisis` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Policy` table. All the data in the column will be lost.
  - Added the required column `file_path` to the `Crisis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Admin', 'MinistryUser');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Crisis" DROP COLUMN "content",
ADD COLUMN     "file_path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "content",
ADD COLUMN     "file_path" TEXT NOT NULL;
