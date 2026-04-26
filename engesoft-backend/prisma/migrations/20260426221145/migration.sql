/*
  Warnings:

  - Added the required column `city` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionName` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateUf` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "institutionName" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "stateUf" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
