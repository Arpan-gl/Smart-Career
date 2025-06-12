import { NextRequest,NextResponse } from "next/server";
import  gitHubAnalysis from "@/lib/fetchRepo";
import { PrismaClient } from "@/prisma/generated/prisma";
import analysisGitHubResponse from "@/lib/analysis";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface ResultResponse{
    GitHubAnalysis: string[];
    LinkedInAnalysis: string[];
    ResumeAnalysis: string[];
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {url} = await request.json();
        if(!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const responseExist = await prisma.githubAnalysis.findFirst({
            where: {
                userId: userId,
                gitHubRepoURL: url
            }
        });

        if( responseExist) {
            const response = {
                GitHubAnalysis: [responseExist.githubResponse],
                LinkedInAnalysis: [responseExist.linkedInResponse],
                ResumeAnalysis: [responseExist.resumeResponse]
            }
            return NextResponse.json({ data: response }, { status: 200 });
        }

        const repoUrl = new URL(url);
        const [owner, repo] = repoUrl.pathname.split('/').slice(1, 3);

        const analysis = await gitHubAnalysis(url);
        if (!analysis) {
            return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
        }

        const commit = analysis.commits.map((commit: { message: string; date: string | undefined }) => ({
            message: commit.message,
            date: commit.date ? new Date(commit.date).toISOString() : undefined
        }));

        const newAnalysis = {
            package_json: analysis.projectFiles,
            commits: commit,
            project_name: repo,
            owner: owner
        }

        const response:ResultResponse = await analysisGitHubResponse(newAnalysis);
        if (!response) {
            return NextResponse.json({ error: "Failed to analyze GitHub response" }, { status: 500 });
        }

        // Save the analysis to the database
        await prisma.githubAnalysis.create({
            data: {
                userId: userId,
                gitHubRepoURL: url,
                githubResponse: response.GitHubAnalysis[0],
                linkedInResponse: response.LinkedInAnalysis[0],
                resumeResponse: response.ResumeAnalysis[0],
            }
        });

        return NextResponse.json({data:response}, { status: 200 });

    } catch (error) {
        console.error("Error in POST /api/githubAnalysis:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}