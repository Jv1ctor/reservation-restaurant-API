/*
  Warnings:

  - You are about to drop the column `table_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `max_capacity` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `opening_hours` on the `restaurants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservation_id]` on the table `tables` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitchen` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximum_price` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimun_price` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservation_id` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_table_id_fkey";

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_user_id_fkey";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "table_id";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "images",
DROP COLUMN "max_capacity",
DROP COLUMN "opening_hours",
ADD COLUMN     "address" VARCHAR NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR NOT NULL,
ADD COLUMN     "kitchen" VARCHAR NOT NULL,
ADD COLUMN     "localization" VARCHAR NOT NULL DEFAULT 'none',
ADD COLUMN     "maximum_price" MONEY NOT NULL,
ADD COLUMN     "minimun_price" MONEY NOT NULL,
ADD COLUMN     "tel" VARCHAR NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "reservation_id" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "timetable" (
    "id" VARCHAR NOT NULL,
    "weekday" VARCHAR NOT NULL,
    "opening_hours" TIME NOT NULL,
    "closing_hours" TIME NOT NULL,
    "restaurant_id" VARCHAR NOT NULL,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tables_reservation_id_key" ON "tables"("reservation_id");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
