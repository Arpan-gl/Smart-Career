-- CreateTable
CREATE TABLE "ResumeResponseByATS" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "atsScore" INTEGER,
    "comparison" TEXT,
    "explanation" TEXT,
    "atsFriendlyResumeResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeResponseByATS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeResponseByATS" ADD CONSTRAINT "ResumeResponseByATS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
