-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "playerOneId" TEXT,
    "playerTwoId" TEXT,
    "isFull" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_playerOneId_key" ON "sessions"("playerOneId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_playerTwoId_key" ON "sessions"("playerTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "words_name_key" ON "words"("name");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
