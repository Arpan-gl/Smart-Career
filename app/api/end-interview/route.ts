import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { generatePerformanceAnalysis } from "@/lib/analysis";

const prisma = new PrismaClient();

interface PerformanceAnalysis {
  overallScore: number;
  categories: {
    communication: number;
    technical: number;
    confidence: number;
    clarity: number;
  };
  strengths: string[];
  improvements: string[];
  detailedFeedback: Array<{
    question: string;
    response: string;
    score: number;
    feedback: string;
  }>;
}

export async function POST(req:NextRequest) {
    try {
        const {finalSession,fileContent} = await req.json();
        if (!fileContent || !finalSession) {
            return NextResponse.json({ message: "File content and final session are required" }, { status: 400 });
        }

        const {userId} = getAuth(req);
        if(!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const interviewDetails = await prisma.mockInterview.findFirst({
            where: {
                userId: userId,
                resumeText: fileContent,
            }
        });
        if (!interviewDetails) {
            return NextResponse.json({ message: "Mock interview not found" }, { status: 404 });
        }

        const questionList = interviewDetails.questions.map((q) => JSON.parse(q).question);
        const answers = interviewDetails.answers;
        
        const getPerformanceResult:PerformanceAnalysis = await generatePerformanceAnalysis({questionList,answers});
        if (!getPerformanceResult) {
            return NextResponse.json({ message: "Error generating performance analysis" }, { status: 500 });
        }

        return NextResponse.json({
            message: "Performance analysis generated successfully",
            data: getPerformanceResult
        }, { status: 200 });
    } catch (error) {
        console.error("Error in end interview route",error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}