-- CreateTable
CREATE TABLE "restaurants" (
    "id" VARCHAR NOT NULL,
    "name_restaurant" VARCHAR NOT NULL,
    "opening_hours" VARCHAR NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "images" VARCHAR[] DEFAULT ARRAY['none', 'none', 'none']::VARCHAR[],
    "user_id" VARCHAR NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" VARCHAR NOT NULL,
    "number_table" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ready',
    "description" VARCHAR NOT NULL,
    "restaurant_id" VARCHAR NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" VARCHAR NOT NULL,
    "number_people" INTEGER NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'pending',
    "date_reservation" TIMESTAMP NOT NULL,
    "date_coming" VARCHAR NOT NULL,
    "observation" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "table_id" VARCHAR NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_user_id_key" ON "restaurants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
