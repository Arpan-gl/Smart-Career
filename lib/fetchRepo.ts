import { Octokit } from 'octokit';

interface ProjectFiles{
    [key: string]: string | null;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function fetchRepoContent(owner:string, repo:string, path = '') {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchFileContent(owner:string, repo:string, path:string) {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
        if (data && 'content' in data && typeof data.content === 'string') {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            return content;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching file ${path}:`, error);
        return null;
    }
}

async function fetchCommits(owner:string, repo:string) {
    try {
        const { data } = await octokit.rest.repos.listCommits({ owner, repo, per_page: 10 });
        return data.map(commit => ({
            sha: commit.sha,
            author: commit.commit.author!.name,
            message: commit.commit.message,
            date: commit.commit.author!.date
        }));
    } catch (error) {
        console.error('Error fetching commits:', error);
        return [];
    }
}

async function analyzeRepo(url:string) {
    try {
        const repoUrl = new URL(url);
        const [owner, repo] = repoUrl.pathname.split('/').slice(1, 3);

        // Fetch root directory files
        const rootFiles = await fetchRepoContent(owner, repo, '');
        const rootFileNames = Array.isArray(rootFiles) ? rootFiles.map(f => f.name) : [];

        const projectFiles: ProjectFiles = {};

        // Check for backend/frontend folders
        let found = false;
        for (const dir of ['backend', 'frontend']) {
            if (rootFileNames.includes(dir)) {
                const dirFiles = await fetchRepoContent(owner, repo, dir);
                const dirFileNames = Array.isArray(dirFiles) ? dirFiles.map(f => f.name) : [];
                if (dirFileNames.includes('package.json')) {
                    projectFiles[`${dir}/package.json`] = await fetchFileContent(owner, repo, `${dir}/package.json`);
                    found = true;
                }
            }
        }

        // Fallback: fetch root package.json if not found in backend/frontend
        if (!found && rootFileNames.includes('package.json')) {
            projectFiles['package.json'] = await fetchFileContent(owner, repo, 'package.json');
        }

        // Optionally, fetch requirements.txt at root
        if (rootFileNames.includes('requirements.txt')) {
            projectFiles['requirements.txt'] = await fetchFileContent(owner, repo, 'requirements.txt');
        }

        const commits = await fetchCommits(owner, repo);

        return {
            projectFiles,
            commits
        };
    } catch (error) {
        console.error('Error analyzing repo:', error);
        return {
            projectFiles: {},
            commits: []
        };
    }
}

export default analyzeRepo;