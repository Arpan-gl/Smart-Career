-- CreateTable
CREATE TABLE "MockInterview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "questions" TEXT[],
    "answers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockInterview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MockInterview" ADD CONSTRAINT "MockInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
