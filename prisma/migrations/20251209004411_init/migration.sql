-- CreateEnum
CREATE TYPE "SubscriptionAlerts" AS ENUM ('temp_high', 'temp_low', 'rain', 'wind', 'humidity', 'snow', 'cloud', 'uv');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "alerts" "SubscriptionAlerts"[],
    "lastAlerts" JSONB,
    "lastSentAt" TIMESTAMP(3),
    "timePref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_phone_key" ON "subscriptions"("phone");
