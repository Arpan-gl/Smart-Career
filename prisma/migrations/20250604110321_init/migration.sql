/*
  Warnings:

  - You are about to drop the column `linkdinResponse` on the `GithubAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `resumaResponse` on the `GithubAnalysis` table. All the data in the column will be lost.
  - Added the required column `linkedInResponse` to the `GithubAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumeResponse` to the `GithubAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubAnalysis" DROP COLUMN "linkdinResponse",
DROP COLUMN "resumaResponse",
ADD COLUMN     "linkedInResponse" TEXT NOT NULL,
ADD COLUMN     "resumeResponse" TEXT NOT NULL;
