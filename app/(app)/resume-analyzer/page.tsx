"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Download, CheckCircle, AlertCircle, Info, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AnalysisResult {
  atsScore: number;
  comparison: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  explanation: {
    overview: string;
    keyIssues: string[];
    improvements: string[];
  };
  optimizedResume?: string;
}

export default function ResumeAnalyzerPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fieldMatch, setFieldMatch] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a resume PDF first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setActiveTab("results");

    // Simulate API call - replace with actual backend integration
    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);
      const data = await axios.post("/api/upload-file", formData);
      const filePath = data.data.filePath; // Assuming the backend returns the file path

      await axios.post("/api/atsScoreGenerator", { filePath, fieldMatch })
        .then((res) => {
          const result = res.data.data;
          const newResult: AnalysisResult = {
            atsScore: result.ATSScore,
            comparison: JSON.parse(result.Comparison),
            explanation: JSON.parse(result.Explanation),
            optimizedResume: result.ATSFriendlyResume
          };
          console.log("Analysis Result:", newResult);
          setAnalysisResult(newResult);
          toast({
            title: "Analysis complete",
            description: `Your resume has been analyzed with an ATS score of ${newResult.atsScore}%.`,
          });
        })
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

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

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setActiveTab("upload");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container max-w-6xl flex-col justify-center items-center py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resume ATS Analyzer</h1>
        <p className="text-lg text-muted-foreground">
          Upload your resume PDF to get detailed ATS scoring, field analysis, and an optimized version for better job application success.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Resume
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2" disabled={!analysisResult && !isAnalyzing}>
            <FileText className="h-4 w-4" />
            Analysis Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF format to analyze ATS compatibility and get optimization suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="fieldMatch">Field Match</Label>
                  <Input
                    id="fieldMatch"
                    placeholder="Enter your resume line..."
                    className="w-full"
                    value={fieldMatch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldMatch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent className="space-y-6">
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                    }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-lg">Drop your resume PDF here...</p>
                  ) : (
                    <>
                      <p className="text-lg mb-2">Drag & drop your resume PDF here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                      <Button variant="outline">
                        Choose File
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg p-6 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">What we'll analyze:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• ATS compatibility score</li>
                    <li>• Resume field completeness</li>
                    <li>• Keyword optimization</li>
                    <li>• Formatting and structure</li>
                    <li>• Industry-specific recommendations</li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={!uploadedFile || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          {isAnalyzing ? (
            <div className="max-w-lg mx-auto text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                  <div className="absolute inset-3 rounded-full border-2 border-dashed border-muted animate-spin-slow" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Analyzing Your Resume</h3>
                <p className="text-muted-foreground">
                  Our AI is scanning your resume for ATS compatibility, analyzing fields, and preparing optimization suggestions.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary rounded animate-pulse" style={{ width: "70%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing PDF</span>
                  <span>Generating insights</span>
                </div>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-8">
              {/* ATS Score Overview */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">ATS Compatibility Score</CardTitle>
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.atsScore)}`}>
                    {analysisResult.atsScore}%
                  </div>
                  <CardDescription>
                    {analysisResult.atsScore >= 80
                      ? "Excellent! Your resume is highly ATS-compatible."
                      : analysisResult.atsScore >= 60
                        ? "Good score, but there's room for improvement."
                        : "Your resume needs optimization for better ATS compatibility."
                    }
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resume Fields Analysis */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Resume Fields Analysis
                    </CardTitle>
                    <CardDescription>
                      Analysis of key resume sections and their quality
                    </CardDescription>
                  </CardHeader>
                </Card> */}

                {/* Comparison Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Strengths & Weaknesses
                    </CardTitle>
                    <CardDescription>
                      Detailed comparison analysis of your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {analysisResult.comparison.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1 text-sm">
                        {analysisResult.comparison.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Detailed Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Overview</h4>
                    <p className="text-muted-foreground">{analysisResult.explanation.overview}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Key Issues</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {analysisResult.explanation.keyIssues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Improvements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {analysisResult.explanation.improvements.map((improvement, index) => (
                          <li key={index}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ATS-Optimized Resume Download */}
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      ATS-Optimized Resume
                    </CardTitle>
                    <CardDescription>
                      Download your optimized resume with improved ATS compatibility
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(analysisResult.optimizedResume!, "Optimized_Resume")}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <CardContent>
                    <p className="font-medium">Optimized_Resume.pdf</p>
                    <p className="text-sm text-muted-foreground">
                      Enhanced for ATS systems with improved formatting and keywords
                    </p>
                    <div className="bg-muted/50 p-6 rounded-md overflow-auto max-h-[600px]">
                      <pre className="whitespace-pre-wrap text-sm">
                        {analysisResult.optimizedResume}
                      </pre>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Recommendations Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>
                    Priority recommendations to improve your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.comparison.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}