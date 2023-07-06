-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_item_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `item_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
