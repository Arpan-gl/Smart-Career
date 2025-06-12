import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProjectFiles {
    [key: string]: string | null;
}

interface Commit {
    message: string;
    date: string | undefined;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const analysisGitHubResponse = async ({ package_json, commits, project_name, owner }: { package_json: ProjectFiles, commits: Commit[], project_name: string, owner: string }) => {
    try {
        const prompt =
            `You are an expert technical writer and project analyst AI.

Given:
- The project name: ${project_name}
- The project owner: ${owner}
- The content of the project's package.json file (including all dependencies and scripts) as ${package_json}
- The project's commit history (messages and dates) as ${JSON.stringify(commits)}

Your tasks:
1. Analyze the package.json to determine the main libraries, frameworks, and tools used in the project. Summarize the tech stack and any notable dependencies.
2. Review the commit history to infer the development process, key features, and project evolution.
3. Using this analysis, generate:
   - A professional README.md summary for the project (not a template, but a real summary tailored to the provided data)
   - A LinkedIn post summary highlighting the project's purpose, tech stack, and achievements
   - A resume-ready bullet point list describing the project’s impact, technologies used, and your role as a contributor in a singlee overview.

Focus on:
- Inferred features and capabilities
- The actual tech stack (from dependencies)
- Development effort and project highlights (from commits)

Output your response as a JSON object in the following format:
{
  "GitHubAnalysis": [string],      // The README.md summary
  "LinkedInAnalysis": [string],    // The LinkedIn post summary
  "ResumeAnalysis": [string]       // The resume bullet points
}

Do not output a template. Base your response only on the provided data.
            `;

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Generate the response
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const responseText = result.response.text();

        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
            responseText.match(/{[\s\S]*}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        }

        throw new Error("Failed to parse JSON response");

    } catch (error) {
        console.error("Error in analysisGitHubResponse:", error);
        throw error;
    }
}

export default analysisGitHubResponse;