/*
  Warnings:

  - You are about to drop the `_categorytopost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categorytopost` DROP FOREIGN KEY `_categorytopost_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_categorytopost` DROP FOREIGN KEY `_categorytopost_ibfk_2`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropTable
DROP TABLE `_categorytopost`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `ContactTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `name` VARCHAR(30) NOT NULL,
    `nickname` CHAR(3) NOT NULL,
    `color` CHAR(7) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `WAId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `shortName` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `pushname` VARCHAR(191) NULL,
    `verifiedName` VARCHAR(191) NULL,
    `isBusiness` BOOLEAN NULL,
    `isEnterprise` BOOLEAN NULL,
    `isMe` BOOLEAN NULL,
    `isMyContact` BOOLEAN NULL,
    `isPSA` BOOLEAN NULL,
    `isUser` BOOLEAN NULL,
    `isVerified` VARCHAR(191) NULL,
    `isWAContact` VARCHAR(191) NULL,
    `plaintextDisabled` BOOLEAN NULL,
    `sectionHeader` VARCHAR(191) NULL,
    `statusMute` BOOLEAN NULL,
    `verifiedLevel` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ContactToContactTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ContactToContactTag_AB_unique`(`A`, `B`),
    INDEX `_ContactToContactTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ContactToContactTag` ADD FOREIGN KEY (`A`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ContactToContactTag` ADD FOREIGN KEY (`B`) REFERENCES `ContactTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
