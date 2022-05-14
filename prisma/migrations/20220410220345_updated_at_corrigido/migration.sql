/*
  Warnings:

  - Made the column `updatedAt` on table `contact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `contacttag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `contact` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `contacttag` MODIFY `updatedAt` DATETIME(3) NOT NULL;
