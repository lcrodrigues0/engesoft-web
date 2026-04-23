-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REVIEWER', 'AUTHOR', 'CHIEF_EDITOR', 'SUBSCRIBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY[]::"Role"[];
