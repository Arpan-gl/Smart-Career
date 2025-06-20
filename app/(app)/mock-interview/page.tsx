"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Upload, FileText, User, Volume2, VolumeX, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { usePathname } from "next/navigation";

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  expectedDuration: number;
}

interface InterviewSession {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  responses: Array<{
    questionId: number;
    response: string;
    duration: number;
    confidence: number;
  }>;
  startTime: Date;
  endTime?: Date;
}

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

export default function MockInterviewPage() {
  const pathname = usePathname();
  const [step, setStep] = useState<'setup' | 'interview' | 'results'>('setup');
  const [field, setField] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [fileContent, setFileContent] = useState<string>("");

  // Interview state
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);

  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Stop audio on route change or unmount (refresh)
    return () => {
      stopAllAudio();
    };
  }, [pathname]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setCurrentResponse(prev => prev + ' ' + finalTranscript);
            setTranscript(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Speech Synthesis
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      loadVoices();
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const startInterview = async () => {
    if (!field || !experience || !resumeFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload your resume.",
        variant: "destructive",
      });
      return; // <-- Add this to prevent further execution
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile!);
      const data = await axios.post("/api/upload-file", formData);
      const filePath = data.data.filePath;
      await axios.post("/api/start-interview", {
        fieldName: field,
        filePath: filePath,
        experience: experience,
        jobDescription: jobDescription.length === 0 ? "" : jobDescription
      })
        .then((res) => {
          const firstQuestion = JSON.parse(res.data.data);
          const mockQuestion: InterviewQuestion[] = [
            {
              id: 1,
              question: firstQuestion.FirstQuestion,
              category: firstQuestion.category,
              expectedDuration: firstQuestion.expectedDuration
            }
          ];
          setMockQuestions(mockQuestion);
          setFileContent(res.data.fileContent);

          // Start session after getting question
          const newSession: InterviewSession = {
            questions: mockQuestion,
            currentQuestionIndex: 0,
            responses: [],
            startTime: new Date()
          };
          setSession(newSession);
          setStep('interview');
          setInterviewStarted(true);

          // Start with first question
          setIsListening(false);
          setCurrentResponse("");
          setTranscript("");
          //  Speak the first question after question come.
          setTimeout(() => {
            speakQuestion(mockQuestion[0].question);
          }, 3000);
        });
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "There was an error starting the interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const speakQuestion = (question: string) => {
    if (isMuted) return; // Prevent speaking if muted
    if (synthRef.current) {
      // Wait for voices to be loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => speakQuestion(question);
        return;
      }
      if (synthRef.current.speaking || synthRef.current.pending) {
        synthRef.current.cancel();
        setTimeout(() => speakQuestion(question), 200); // Delay to allow cancel
        return;
      }
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      utterance.onstart = () => setIsAISpeaking(true);
      utterance.onend = () => {
        setIsAISpeaking(false);
        setTimeout(() => startListening(), 500);
      };
      synthRef.current.speak(utterance);
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setCurrentResponse("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      setTranscript("");
      recognitionRef.current.stop();
    }
  };

  const nextQuestion = async () => {
    if (!session) return;

    // Save current response
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const newResponse = {
      questionId: currentQuestion.id,
      response: currentResponse,
      duration: 90, // Mock duration
      confidence: Math.random() * 40 + 60 // Mock confidence score
    };

    if (session.questions.length > 5) {
      setCurrentResponse("");
      stopListening();
      endInterview(session);
      return;
    }

    let nextQuestionData = null;
    try {
      const res = await axios.post("/api/save-response", {
        question: currentQuestion.question,
        response: currentResponse,
        fileContent: fileContent,
        numberOfQuestions: session.questions.length
      });
      if (res.data && res.data.data) {
        nextQuestionData = JSON.parse(res.data.data);
      }
    } catch (error) {
      console.error("Failed to save response:", error);
    }

    // Update session and questions
    const updatedQuestions = [...session.questions];
    if (nextQuestionData && nextQuestionData.question) {
      updatedQuestions.push({
        id: currentQuestion.id + 1,
        question: nextQuestionData.question,
        category: nextQuestionData.category,
        expectedDuration: nextQuestionData.expectedDuration
      });
    }

    const updatedSession = {
      ...session,
      responses: [...session.responses, newResponse],
      questions: updatedQuestions,
      currentQuestionIndex: session.currentQuestionIndex + 1
    };

    setSession(updatedSession);
    setMockQuestions(updatedQuestions);
    setCurrentResponse("");
    stopListening();

    // If no next question, end interview
    if (!nextQuestionData || !nextQuestionData.question) {
      endInterview(updatedSession);
      return;
    }

    // Speak next question
    setTimeout(() => {
      speakQuestion(updatedQuestions[updatedSession.currentQuestionIndex].question);
    }, 1000);
  };

  const endInterview = async (finalSession: InterviewSession) => {
    stopAllAudio();
    const endTime = new Date();
    const completedSession = { ...finalSession, endTime };

    // Generate mock performance analysis
    // const mockAnalysis: PerformanceAnalysis = {
    //   overallScore: Math.floor(Math.random() * 30 + 70),
    //   categories: {
    //     communication: Math.floor(Math.random() * 30 + 70),
    //     technical: Math.floor(Math.random() * 30 + 70),
    //     confidence: Math.floor(Math.random() * 30 + 70),
    //     clarity: Math.floor(Math.random() * 30 + 70)
    //   },
    //   strengths: [
    //     "Clear articulation of technical concepts",
    //     "Good understanding of industry trends",
    //     "Confident delivery",
    //     "Relevant examples from experience"
    //   ],
    //   improvements: [
    //     "Could provide more specific metrics in examples",
    //     "Consider structuring answers using STAR method",
    //     "Expand on leadership experiences",
    //     "Practice concise responses"
    //   ],
    //   detailedFeedback: completedSession.responses.map((response, index) => ({
    //     question: completedSession.questions[index].question,
    //     response: response.response,
    //     score: Math.floor(Math.random() * 30 + 70),
    //     feedback: "Good response with relevant examples. Consider adding more specific details about your achievements."
    //   }))
    // };
    try {
      await axios.post("/api/end-interview", { finalSession: completedSession,fileContent: fileContent })
        .then((res) => {
          const mockAnalysis: PerformanceAnalysis = res.data.data;
          if (!mockAnalysis) {
            throw new Error("No performance analysis data received");
          }
          setPerformanceAnalysis(mockAnalysis);
        })
    } catch (error) {
      console.error("Error generating performance analysis:", error);
      toast({
        title: "Error",
        description: "There was an error generating the performance analysis. Please try again.",
        variant: "destructive",
      });
    }

    setSession(completedSession);
    setStep('results');
    stopListening();
  };

  const stopAllAudio = () => {
    // Stop AI speaking
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsAISpeaking(false);
    }
    // Stop user audio (speech recognition)
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    }
    // Stop media recorder if used in future
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const resetInterview = () => {
    stopAllAudio();
    setStep('setup');
    setSession(null);
    setPerformanceAnalysis(null);
    setCurrentResponse("");
    setInterviewStarted(false);
    stopListening();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  if (step === 'setup') {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Mock Interview</h1>
          <p className="text-lg text-muted-foreground">
            Practice your interview skills with our AI-powered mock interview system.
            Get real-time feedback and improve your performance.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
            <CardDescription>
              Provide your details to customize the interview experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field">Field/Industry</Label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your field" />
                  </SelectTrigger>
                  <SelectContent className=" bg-white text-black">
                    <SelectItem value="software-engineering">Software Engineering</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="ml-engineering">ML Engineer</SelectItem>
                    <SelectItem value="devops-engineering">Devops Engineer</SelectItem>
                    <SelectItem value="product-management">Product Management</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="full-stack-web-development">Full Stack Web Developer</SelectItem>
                    <SelectItem value="blockchain-development">BlockChain Developer</SelectItem>
                    <SelectItem value="cloud-engineering">Cloud Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent className=" bg-white text-black">
                    <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                    <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                    <SelectItem value="4-6">4-6 years (Mid Level)</SelectItem>
                    <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                    <SelectItem value="10+">10+ years (Expert)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Resume (PDF)</Label>
              {!resumeFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                    }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  {isDragActive ? (
                    <p>Drop your resume here...</p>
                  ) : (
                    <p>Drag & drop your resume PDF or click to browse</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{resumeFile.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setResumeFile(null)}>
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description (Optional)</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description to get more targeted questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What to expect:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 5-7 customized interview questions</li>
                <li>• Voice interaction with AI interviewer</li>
                <li>• Real-time speech recognition</li>
                <li>• Detailed performance analysis</li>
                <li>• Personalized improvement suggestions</li>
              </ul>
            </div>

            <Button
              className="w-full hover:border-white"
              onClick={startInterview}
              disabled={!field || !experience || !resumeFile}
            >
              Start Mock Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'interview') {
    const currentQuestion = session?.questions[session.currentQuestionIndex];
    const progress = session ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="container max-w-7xl py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">Interview generation</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    Question {session?.currentQuestionIndex ? session.currentQuestionIndex + 1 : 1} of {session?.questions.length}
                  </Badge>
                  <div className="w-32">
                    <Progress value={progress} className="h-1 bg-gray-800" />
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => endInterview(session!)}
                className="bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>
        </div>

        {/* Main Interview Interface */}
        <div className="container max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* AI Interviewer Panel (2/3) */}
            <div className="lg:col-span-2 relative flex flex-col gap-8">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-gray-700 overflow-hidden relative">
                {/* AI Avatar/Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Speaking Indicator */}
                {isAISpeaking && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white">AI is speaking...</span>
                  </div>
                )}
                {/* AI Name Label */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white font-medium">AI Interviewer</span>
                </div>
              </div>

              {/* Question Display */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 mb-2">
                      {currentQuestion?.category}
                    </Badge>
                    <h3 className="text-lg font-medium text-white mb-2">Current Question</h3>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    Expected: {currentQuestion?.expectedDuration}s
                  </div>
                </div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>
            </div>

            {/* User/Response Panel (1/3) */}
            <div className="flex flex-col gap-8">
              {/* User Panel */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden relative">
                {/* User Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                {/* Recording Indicator */}
                {isListening && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-medium">Recording...</span>
                  </div>
                )}
                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isMuted ? "destructive" : "secondary"}
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
                {/* User Name Label */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white font-medium">You</span>
                </div>
              </div>

              {/* Response Area */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 flex flex-col h-full">
                <h3 className="text-lg font-medium text-white mb-4">Your Response</h3>
                <div className="min-h-[120px] p-4 bg-gray-900/50 rounded-xl border border-gray-600 mb-4 flex-1">
                  {currentResponse ? (
                    <p className="text-gray-200">{currentResponse}</p>
                  ) : (
                    <p className="text-gray-500">
                      {isListening ? "Listening... Speak your answer" : "Click the microphone to start speaking"}
                    </p>
                  )}
                </div>
                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    disabled={isAISpeaking}
                    className="rounded-full w-16 h-16 p-0"
                  >
                    {isListening ? (
                      <Mic className="h-6 w-6" /> // Open mic when recording
                    ) : (
                      <MicOff className="h-6 w-6" /> // Closed mic when not recording
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={nextQuestion}
                    disabled={!currentResponse.trim() || isAISpeaking}
                    className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  >
                    Next Question
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isAISpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-gray-300">AI Status</span>
              </div>
              <p className="text-xs text-gray-400">
                {isAISpeaking ? "Speaking question..." : "Ready"}
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-gray-300">Recording</span>
              </div>
              <p className="text-xs text-gray-400">
                {isListening ? "Listening..." : "Stopped"}
              </p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-300">Progress</span>
              </div>
              <p className="text-xs text-gray-400">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && performanceAnalysis) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interview Performance Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Here's your detailed performance analysis with personalized feedback
          </p>
        </div>

        <div className="space-y-8">
          {/* Overall Score */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Performance Score</CardTitle>
              <div className={`text-6xl font-bold ${getScoreColor(performanceAnalysis.overallScore)}`}>
                {performanceAnalysis.overallScore}%
              </div>
              <CardDescription>
                {performanceAnalysis.overallScore >= 80
                  ? "Excellent performance! You're well-prepared for interviews."
                  : performanceAnalysis.overallScore >= 60
                    ? "Good performance with room for improvement."
                    : "Consider more practice to improve your interview skills."
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(performanceAnalysis.categories).map(([category, score]) => (
              <Card key={category}>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <Progress value={score} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Strengths</CardTitle>
                <CardDescription>What you did well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {performanceAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                <CardDescription>Focus areas for your next interview</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {performanceAnalysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Question Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Feedback</CardTitle>
              <CardDescription>Detailed analysis of each response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceAnalysis.detailedFeedback.map((feedback, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sm">Question {index + 1}</h4>
                      <Badge className={getScoreBadgeColor(feedback.score)}>
                        {feedback.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feedback.question}</p>
                    <div className="bg-muted/50 p-3 rounded text-sm mb-2">
                      <strong>Your Response:</strong> {feedback.response || "No response recorded"}
                    </div>
                    <p className="text-sm">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={resetInterview} variant="outline">
              Take Another Interview
            </Button>
            <Button onClick={() => window.print()}>
              Download Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}