-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'CONTRIBUTOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'GUEST';
