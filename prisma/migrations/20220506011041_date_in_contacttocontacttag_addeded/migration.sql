/*
  Warnings:

  - You are about to drop the `_contacttocontacttag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_contacttocontacttag` DROP FOREIGN KEY `_contacttocontacttag_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_contacttocontacttag` DROP FOREIGN KEY `_contacttocontacttag_ibfk_2`;

-- DropTable
DROP TABLE `_contacttocontacttag`;

-- CreateTable
CREATE TABLE `Contacttocontacttag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`A`, `B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contacttocontacttag` ADD CONSTRAINT `Contacttocontacttag_B_fkey` FOREIGN KEY (`B`) REFERENCES `ContactTag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contacttocontacttag` ADD CONSTRAINT `Contacttocontacttag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
