import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { generateNextQuestion } from "@/lib/analysis";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { question, response,fileContent,numberOfQuestions } = await req.json();
        if (!question || !response) {
            return NextResponse.json({ message: "question and response is required" }, { status: 400 });
        }

        const userId = getAuth(req).userId;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const fetchDetails = await prisma.mockInterview.findFirst({
            where: {
                userId: userId,
                resumeText: fileContent,
            }
        });
        if (!fetchDetails) {
            return NextResponse.json({ message: "Mock interview not found" }, { status: 404 });
        }

        const nextQuestion = await generateNextQuestion({ lastQuestion: question, answer: response,numberOfQuestions });
        if (!nextQuestion) {
            return NextResponse.json({ message: "Mock interview completed" }, { status: 400 });
        }

        await prisma.mockInterview.update({
            where: {
                id: fetchDetails.id
            },
            data: {
                answers: {
                    push: response
                },
                questions: {
                    push: JSON.stringify(nextQuestion)
                }
            }
        });
        return NextResponse.json({ message: "Response stored successfully", data: JSON.stringify(nextQuestion) }, { status: 200 });
    } catch (error) {
        console.error("Error in save response", error);
        return NextResponse.json({ message: "error in store the response" }, { status: 500 });
    }
}