-- CreateTable
CREATE TABLE "transaction_queues" (
    "uid" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "queue" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL DEFAULT '{}',
    "state" INTEGER NOT NULL DEFAULT 9,
    "received_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submited_utc" TIMESTAMP(3) NOT NULL,
    "done_utc" TIMESTAMP(3),
    "retries" INTEGER NOT NULL DEFAULT 0,
    "MinaTxId" TEXT NOT NULL DEFAULT '',
    "MinaTxStatus" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "transaction_queues_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_queues_uid_key" ON "transaction_queues"("uid");
