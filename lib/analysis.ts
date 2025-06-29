import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProjectFiles {
    [key: string]: string | null;
}

interface Commit {
    message: string;
    date: string | undefined;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
   - A professional github repository analysis summary for the project (not a template, but a real summary tailored to the provided data)
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

const analysisResumeAndGetATSScore = async ({ atsFriendlyResumeResponse, fieldMatch }: { atsFriendlyResumeResponse: string, fieldMatch: string }) => {
    try {
        const prompt = `
        You are an expert ATS score generator.

Given:
- ATS-friendly resume response: ${atsFriendlyResumeResponse}
- Job description field match: ${fieldMatch}

Your tasks:
1. Analyze the ATS-friendly resume response to extract relevant information about the candidate's skills, experience, and education.
2. Compare this extracted information with the job description field match to assess the candidate's fit for the role.
3. Generate an ATS score based on the comparison, considering the candidate's qualifications and the job requirements.

Output your response as a JSON object in the following format:
{
  "ATSScore": number,       // The ATS score
  "Comparison": {            // A detailed comparison of the resume and job description
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  },
  "Explanation": {          // Why the ATS score was generated (for example, based on skill matches)
    overview: string;
    keyIssues: string[];
    improvements: string[];
  }     
}
        `;
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
        console.error("Error in analysisResumeAndGetATSScore:", error);
        throw error;
    }
}

const generateATSFriendlyResume = async ({ atsFriendlyResumeResponse, fieldMatch }: { atsFriendlyResumeResponse: string, fieldMatch: string }) => {
    try {
        const prompt = `
        You are an expert ATS resume generator.

Given:
- ATS-friendly resume response: ${atsFriendlyResumeResponse}
- Job description field match: ${fieldMatch}

Your tasks:
1. Analyze the ATS-friendly resume response to extract relevant information about the candidate's skills, experience, and education.
2. Generate an ATS friendly resume based on the comparison, considering the candidate's qualifications and the job requirements.

Output your response as a JSON object in the following format:
{
  "ATSFriendlyResume": string,       // The ATS friendly resume
    }
        `;
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
        console.error("Error in generateATSFriendlyResume:", error);
        throw error;
    }
}

const generateFirstQuestion = async ({ fieldName, resumeText, experience, jobDescription }: { fieldName: string, resumeText: string, experience: string, jobDescription: string }) => {
    try {
        const prompt = `
        You are an expert interview question generator.
Given:
- Field name: ${fieldName}
- Resume text: ${resumeText}
- Experience: ${experience}
- Job description: ${jobDescription}
Your tasks:
1. Analyze the resume text to understand the candidate's skills, experience, and qualifications.
2. Based on the field name and job description, generate a relevant first question for the interview that assesses the candidate's fit for the role.
3. Interview question should be open-ended, allowing the candidate to demonstrate their knowledge and experience.
4. Interview question should also include friendly follow-up questions to keep the conversation going.
Output your response as a JSON object in the following format:
{
    "question": string       // The generated first question for the interview
    "expectedDuration": Number // The expected duration for the answer
    "category": string          // The category of the question
}`;

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
        console.error("Error in generateFirstQuestion:", error);
        throw error;
    }
}

const generateNextQuestion = async ({ lastQuestion, answer, numberOfQuestions }: { lastQuestion: string, answer: string, numberOfQuestions: number }) => {
    try {
        const prompt = `
You are an expert interview question generator and evaluator.

Given:
- Last question: ${lastQuestion}
- Answer: ${answer}   // most recent answer from the user.
- Number of questions asked so far out of 6: ${numberOfQuestions}

Your tasks:
1. Analyze the last question, answer to understand the candidate’s communication, skills, and relevance to the role.
2. Based on the analysis, either:
    a. Generate a relevant and meaningful next question for the interview that evaluates the candidate further,
    OR
    b. If you determine the interview has reached a logical conclusion (e.g., all critical topics have been covered, or candidate is clearly unfit or highly suitable), respond with a message: "OK, you may leave the call now."
3. Interview question should be open-ended, allowing the candidate to demonstrate their knowledge and experience.
4. Interview question should also include friendly follow-up questions to keep the conversation going.

Output your response as a JSON object in the following format:

If you are continuing the interview:
{
    "question": string,         // The next question for the interview
    "expectedDuration": number, // Expected time (in minutes) for answering
    "category": string          // The category of the question (e.g., Technical, Behavioral, Communication)
}
`;

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
        console.error("Error in generate new question", error);
        throw error;
    }
}

const generatePerformanceAnalysis = async ({questionList,answers}:{questionList:string[],answers:string[]}) => {
    try {
        const prompt = `
        You are an expert performance analysis AI.
        Given:
        - A list of questions asked during the interview: ${JSON.stringify(questionList)}
        - A list of answers provided by the candidate: ${JSON.stringify(answers)}
        Your tasks:
        1. Analyze the answers in relation to the questions to assess the candidate's performance.
        2. Evaluate the candidate's communication skills, technical knowledge, confidence, and clarity.
        3. Generate a detailed performance analysis report that includes:
        - Overall score (out of 100)
        - Scores for each category (communication, technical, confidence, clarity)
        - Strengths and areas for improvement
        - Detailed feedback for each question and answer pair, including score and feedback
        4. The analysis should be comprehensive, providing insights into the candidate's suitability for the role based on their responses.
        5. Also do for beginner friendly, so the candidate can understand the feedback and improve in the future. Also give some better result if they answer all the questions.
        Output your response as a JSON object in the following format:
        {
            overallScore: number,   // Overall score out of 100
            categories: {   // Scores for each category
                communication: number,
                technical: number,
                confidence: number,
                clarity: number
            },
            strengths: string[],   // List of strengths identified in the candidate's performance
            improvements: string[],  // List of areas for improvement
            detailedFeedback: [    // Array of objects containing detailed feedback for each question and answer pair
                {
                    question: string,
                    response: string,
                    score: number,
                    feedback: string
                }   
            ]
        }
`;

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
        console.error("Error to geneate the analysis of preformance",error);
        throw error;
    }
}

export { analysisResumeAndGetATSScore, analysisGitHubResponse, generateATSFriendlyResume, generateFirstQuestion , generateNextQuestion, generatePerformanceAnalysis };