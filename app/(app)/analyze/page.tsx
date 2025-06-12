"use client";

import { useState, useEffect } from "react";
import { Download, Github, Loader2, Copy, FileDown, Linkedin, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface AnalysisResult {
  GitHubAnalysis: string;
  LinkedInAnalysis: string;
  ResumeAnalysis: string;
}

export default function AnalyzePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [activeTab, setActiveTab] = useState("readme");
  const [copiedStates, setCopiedStates] = useState({
    readme: false,
    linkedin: false,
    resume: false
  });
  const { toast } = useToast();

  const isValidGithubUrl = (url: string) => {
    // Simple validation for GitHub URL format
    return url.trim().match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repoUrl) {
      toast({
        title: "Repository URL is required",
        description: "Please enter a GitHub repository URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidGithubUrl(repoUrl)) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo).",
        variant: "destructive",
      });
      return;
    }

    const urlParts = repoUrl.replace(/\/$/, "").split("/");
    setOwner(urlParts[urlParts.length - 2] || "");
    setRepo(urlParts[urlParts.length - 1] || "");

    setIsAnalyzing(true);

    try {
      await axios.post("/api/githubAnalysis", { url: repoUrl })
        .then((res) => {
          const data = res.data.data as AnalysisResult;
          setResult(data);
          toast({
            title: "Analysis Started",
            description: "Your repository is being analyzed. You will be redirected to the results page shortly."
          });
        });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your repository. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }

  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `${filename} has been downloaded.`,
    });
  };

  useEffect(() => {
    const timeouts = Object.keys(copiedStates).map(key => {
      if (copiedStates[key as keyof typeof copiedStates]) {
        return setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      }
      return undefined;
    });

    return () => {
      timeouts.forEach(timeout => timeout && clearTimeout(timeout));
    };
  }, [copiedStates]);

  return (
    <div className="container max-w-6xl py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Analyze Your GitHub Repository</h1>
        <p className="text-lg text-muted-foreground">
          Enter your GitHub repository URL below to generate a professional README,
          LinkedIn summary, and resume-ready project description.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Repository Analysis</CardTitle>
          <CardDescription>
            Provide your GitHub repository URL to start the analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-sm font-medium">
                GitHub Repository URL
              </label>
              <div className="flex items-center rounded-md border px-3 py-1 focus-within:ring-1 focus-within:ring-ring">
                <Github className="mr-2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="repo-url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 border-0 focus-visible:outline-none focus-visible:ring-0 px-0 py-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Example: https://github.com/facebook/react
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Repository...
              </>
            ) : (
              "Generate Analysis"
            )}
          </Button>
        </CardFooter>
      </Card>

      {isAnalyzing && (
        <div className="mt-16 max-w-lg mx-auto">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                <div className="absolute inset-3 rounded-full border-2 border-dashed border-muted animate-spin-slow" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Analyzing Repository</h3>
              <p className="text-muted-foreground">
                Our AI is scanning your repository, analyzing code patterns, and generating professional documentation.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary rounded animate-progress origin-left" style={{ width: "60%" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Scanning repository</span>
                <span>Generating documentation</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        result && (
          <div className="container max-w-6xl py-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Github className="h-6 w-6" />
                <h1 className="text-3xl font-bold">{owner}/{repo}</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Here are your generated results. You can view, copy, or download each section.
              </p>
            </div>

            <Tabs defaultValue="readme" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="readme" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  README.md
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Summary
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Resume Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="readme" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>README.md</CardTitle>
                      <CardDescription>
                        A professional README for your GitHub repository.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(result?.GitHubAnalysis, "readme")}
                      >
                        {copiedStates.readme ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedStates.readme ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(result?.GitHubAnalysis, "README.md")}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-6 rounded-md overflow-auto max-h-[600px]">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result?.GitHubAnalysis}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="linkedin" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>LinkedIn Summary</CardTitle>
                      <CardDescription>
                        A professional project description for your LinkedIn profile.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(result?.LinkedInAnalysis, "linkedin")}
                      >
                        {copiedStates.linkedin ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedStates.linkedin ? "Copied!" : "Copy"}   
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                      >
                        <Linkedin className="h-4 w-4 mr-1" /> Post to LinkedIn
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-6 rounded-md">
                      <p className="whitespace-pre-wrap">{result?.LinkedInAnalysis}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resume" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Resume Summary</CardTitle>
                      <CardDescription>
                        A professional project description for your resume.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(result?.ResumeAnalysis, "resume")}
                      >
                        {copiedStates.resume ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedStates.resume ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(result?.ResumeAnalysis, `${repo}-resume.txt`)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-6 rounded-md">
                      <pre className="whitespace-pre-wrap">{result?.ResumeAnalysis}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
    </div>
  )
}