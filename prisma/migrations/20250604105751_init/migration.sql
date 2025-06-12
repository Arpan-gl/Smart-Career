/*
  Warnings:

  - You are about to drop the `Github` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Github" DROP CONSTRAINT "Github_userId_fkey";

-- DropTable
DROP TABLE "Github";

-- CreateTable
CREATE TABLE "GithubAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gitHubRepoURL" TEXT NOT NULL,
    "linkdinResponse" TEXT NOT NULL,
    "resumaResponse" TEXT NOT NULL,
    "githubResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GithubAnalysis" ADD CONSTRAINT "GithubAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
