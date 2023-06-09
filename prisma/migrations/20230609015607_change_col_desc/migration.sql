/*
  Warnings:

  - You are about to drop the column `descripton` on the `item` table. All the data in the column will be lost.
  - Added the required column `description` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_category_id_fkey`;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `descripton`,
    ADD COLUMN `description` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
