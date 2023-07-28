-- CreateTable
CREATE TABLE "merkle_map" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "root" BIGINT NOT NULL,
    "size" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merkle_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merkle_map_leaf" (
    "uid" TEXT NOT NULL,
    "merkle_map_id" INTEGER NOT NULL,
    "index" BIGINT NOT NULL,
    "key" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "data" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merkle_map_leaf_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "sessions" (
    "uid" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "persons" (
    "uid" TEXT NOT NULL,
    "account_id" TEXT,
    "state" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT DEFAULT '',
    "telegram" TEXT DEFAULT '',
    "preferences" TEXT DEFAULT '{}',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "communities" (
    "uid" TEXT NOT NULL,
    "account_id" TEXT,
    "admin_uid" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),

    CONSTRAINT "communities_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "members" (
    "uid" TEXT NOT NULL,
    "communityUid" TEXT NOT NULL,
    "personUid" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '0',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedUTC" TIMESTAMP(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "claims" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "applicant_uid" TEXT NOT NULL,
    "plan_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "account_id" TEXT,
    "alias" TEXT,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voted_utc" TIMESTAMP(3),
    "issued_utc" TIMESTAMP(3),
    "due_utc" TIMESTAMP(3),
    "required_votes" INTEGER DEFAULT 0,
    "required_positives" INTEGER DEFAULT 0,
    "positive_votes" INTEGER DEFAULT 0,
    "negative_votes" INTEGER DEFAULT 0,
    "ignored_votes" INTEGER DEFAULT 0,
    "evidence_data" TEXT DEFAULT '',

    CONSTRAINT "claims_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "plans" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "alias" TEXT,
    "description" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "template" TEXT DEFAULT '',
    "evidence" TEXT DEFAULT '[]',
    "strategy" TEXT DEFAULT '{}',
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_utc" TIMESTAMP(3),
    "fee" INTEGER DEFAULT 0,
    "rewards_share" INTEGER DEFAULT 0,
    "community_share" INTEGER DEFAULT 0,
    "protocol_share" INTEGER DEFAULT 0,
    "total" INTEGER DEFAULT 1,
    "available" INTEGER DEFAULT 1,
    "expiration" INTEGER DEFAULT 0,
    "revocable" BOOLEAN DEFAULT false,
    "starts_utc" TIMESTAMP(3),
    "ends_utc" TIMESTAMP(3),

    CONSTRAINT "plans_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "credentials" (
    "uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "type" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "image" TEXT DEFAULT '',
    "alias" TEXT DEFAULT '',
    "starts" INTEGER DEFAULT 0,
    "metadata" TEXT DEFAULT '{}',
    "issued_utc" TIMESTAMP(3),
    "expires _utc" TIMESTAMP(3),

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "tasks" (
    "uid" TEXT NOT NULL,
    "claim_uid" TEXT NOT NULL,
    "assignee_uid" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "assigned_utc" TIMESTAMP(3),
    "completed_utc" TIMESTAMP(3),
    "due_utc" TIMESTAMP(3),
    "rewarded" INTEGER DEFAULT 0,
    "reason" INTEGER DEFAULT 0,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "proposeds" (
    "uid" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person_uid" TEXT NOT NULL,
    "community_uid" TEXT NOT NULL,
    "created_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposeds_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_uid_key" ON "sessions"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "persons_uid_key" ON "persons"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "persons_email_key" ON "persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "communities_uid_key" ON "communities"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "members_uid_key" ON "members"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "claims_uid_key" ON "claims"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "plans_uid_key" ON "plans"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_uid_key" ON "credentials"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_uid_key" ON "tasks"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "proposeds_uid_key" ON "proposeds"("uid");

-- AddForeignKey
ALTER TABLE "merkle_map_leaf" ADD CONSTRAINT "merkle_map_leaf_merkle_map_id_fkey" FOREIGN KEY ("merkle_map_id") REFERENCES "merkle_map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
