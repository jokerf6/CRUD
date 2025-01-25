/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post3` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `post2` DROP FOREIGN KEY `post2_userId_fkey`;

-- DropForeignKey
ALTER TABLE `post3` DROP FOREIGN KEY `post3_userId_fkey`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `post2`;

-- DropTable
DROP TABLE `post3`;
