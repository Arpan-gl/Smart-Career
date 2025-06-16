import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma";
import { upload } from "@/lib/multer";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import { getAuth } from "@clerk/nextjs/server";
import {analysisResumeAndGetATSScore,generateATSFriendlyResume} from "@/lib/analysis";
import fs from "fs";

const prisma = new PrismaClient();

interface ATSScoreResponse {
    ATSScore: number;
    Comparison: {
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
    };
    Explanation: {
        overview: string;
        keyIssues: string[];
        improvements: string[];
    }
}

interface ATSFriendlyResumeResponse {
    ATSFriendlyResume: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const filePath = body.filePath as string;
        if (!filePath) {
            return NextResponse.json({ error: "File path is required" }, { status: 400 });
        }
        const fieldMatch = body.fieldMatch as string;
        if (!fieldMatch) {
            return NextResponse.json({ error: "Field match is required" }, { status: 400 });
        }
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
    
        // Save the file using multer (wrapped in a Promise)
        // const filePath: string | undefined = await new Promise((resolve, reject) => {
        //     upload.single("file")(req as any, {} as any, function (err: any) {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             const uploadedFile = (req as any).file;
        //             console.log(uploadedFile)
        //             resolve(uploadedFile?.path);
        //         }
        //     });
        // });
        // if (!filePath) {
        //     return NextResponse.json({ error: "File upload failed" }, { status: 500 });
        // }

        const pdfLoader = new PDFLoader(filePath);
        const documents = await pdfLoader.load();
        // console.log("Documents loaded:", documents);
        // Here you would implement your logic to analyze the file and generate the score
        const responseText = documents.map((doc) => doc.pageContent).join("\n");
        // console.log("Response text:", responseText);
        const isExist = await prisma.resumeResponseByATS.findFirst({
            where:{
                userId: userId,
                resumeText: responseText
            }
        });

        if(isExist) {
            const resumeResponse = {
                ATSScore: isExist.atsScore,
                Comparison: isExist.comparison,
                Explanation: isExist.explanation,
                ATSFriendlyResume: isExist.atsFriendlyResumeResponse
            }
            fs.unlinkSync(filePath); // Clean up the uploaded file after processing
            return NextResponse.json({data:resumeResponse}, { status: 200 });
        }

        const responseAsScore: ATSScoreResponse = await analysisResumeAndGetATSScore({ atsFriendlyResumeResponse: responseText, fieldMatch });

        if(!responseAsScore.ATSScore || !responseAsScore.Comparison || !responseAsScore.Explanation) {
            return NextResponse.json({ error: "Can't generate ATS score" }, { status: 500 });
        }

        const getAtsFriendlyResumeResponse:ATSFriendlyResumeResponse = await generateATSFriendlyResume({ atsFriendlyResumeResponse: responseText, fieldMatch });
        if(!getAtsFriendlyResumeResponse.ATSFriendlyResume){
            return NextResponse.json({ error: "Can't generate ATS friendly resume" }, { status: 500 });
        }

        const resumeResponse = {
            ATSScore: responseAsScore.ATSScore,
            Comparison: JSON.stringify(responseAsScore.Comparison),
            Explanation: JSON.stringify(responseAsScore.Explanation),
            ATSFriendlyResume: getAtsFriendlyResumeResponse.ATSFriendlyResume
        }
        // console.log("Resume response:", resumeResponse);
        await prisma.resumeResponseByATS.create({
            data: {
                userId,
                resumeText: responseText,
                atsScore: responseAsScore.ATSScore,
                comparison: JSON.stringify(responseAsScore.Comparison),
                explanation: JSON.stringify(responseAsScore.Explanation),
                atsFriendlyResumeResponse: getAtsFriendlyResumeResponse.ATSFriendlyResume,
            }
        });
        fs.unlinkSync(filePath); // Clean up the uploaded file after processing
        return NextResponse.json({data:resumeResponse}, { status: 200 });
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Can't generate ATS score" }, { status: 500 });
    }   
}