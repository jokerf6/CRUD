/*
  Warnings:

  - You are about to drop the column `first_nae` on the `user` table. All the data in the column will be lost.
  - Added the required column `first` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `first_nae`,
    ADD COLUMN `first` VARCHAR(191) NOT NULL,
    ADD COLUMN `last` VARCHAR(191) NOT NULL;
