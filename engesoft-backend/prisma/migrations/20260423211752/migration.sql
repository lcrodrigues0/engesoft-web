/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BaseType" AS ENUM ('GUEST', 'CONTRIBUTOR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "baseType" "BaseType" NOT NULL DEFAULT 'GUEST';

-- DropEnum
DROP TYPE "Role";
