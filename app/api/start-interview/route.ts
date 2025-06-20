import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateFirstQuestion } from "@/lib/analysis";
import { getAuth } from "@clerk/nextjs/server";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fieldName, filePath, experience, jobDescription } = body;
        if (!fieldName || !filePath || !experience) {
            return NextResponse.json({ message: "Please provide all required information" }, { status: 400 });
        }

        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const pdfLoader = new PDFLoader(filePath);
        const documents = await pdfLoader.load();
        // Here you would implement your logic to analyze the file and generate the score
        const responseText = documents.map((doc) => doc.pageContent).join("\n");

        const isExist = await prisma.mockInterview.findFirst({
            where: {
                userId: userId,
                fieldName: fieldName,
                resumeText: responseText,
                experience: experience,
            }
        });

        if (isExist) {
            const firstQuestionObj = JSON.parse(isExist.questions[0]);
            const firstQuestion = JSON.stringify({
                question: firstQuestionObj.question,
                expectedDuration: firstQuestionObj.expectedDuration,
                category: firstQuestionObj.category
            });
            await prisma.mockInterview.update({
                where: {
                    id: isExist.id
                },
                data: {
                    answers: [],
                    questions: [firstQuestion]
                }
            });
            fs.unlinkSync(filePath);
            const firstQuestionAfterGivingInfo = JSON.stringify({
                FirstQuestion: firstQuestionObj.question,
                expectedDuration: firstQuestionObj.expectedDuration,
                category: firstQuestionObj.category
            });
            return NextResponse.json({ message: "Mock interview already exists", data: firstQuestionAfterGivingInfo, fileContent: isExist.resumeText }, { status: 200 });
        }

        const firstQuestionAfterGivingInfo = await generateFirstQuestion({ fieldName: fieldName, resumeText: responseText, experience: experience, jobDescription: jobDescription });
        const firstQuestion = JSON.stringify({
            FirstQuestion: firstQuestionAfterGivingInfo.question,
            expectedDuration: firstQuestionAfterGivingInfo.expectedDuration,
            category: firstQuestionAfterGivingInfo.category
        });

        await prisma.mockInterview.create({
            data: {
                userId: userId,
                fieldName: fieldName,
                resumeText: responseText,
                experience: experience,
                questions: [JSON.stringify(firstQuestionAfterGivingInfo)],
                answers: [],
            }
        });

        fs.unlinkSync(filePath);
        return NextResponse.json({ message: "Mock interview started successfully", data: firstQuestion,fileContent:responseText }, { status: 200 });

    } catch (error) {
        console.error("Error in start interview", error);
        return NextResponse.json({ message: "there is an error in start interview" }, { status: 500 });
    }
}