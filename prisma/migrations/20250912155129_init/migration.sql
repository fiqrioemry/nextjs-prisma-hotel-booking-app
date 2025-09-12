/*
  Warnings:

  - Added the required column `location` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Hotel" ADD COLUMN     "location" TEXT NOT NULL;
