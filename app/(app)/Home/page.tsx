import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCode, GitBranch, Linkedin, FileText, Upload, Brain, Target, Zap, Shield, CheckCircle, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
        </div>
        <div className="container relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
                  <Brain className="w-3 h-3 mr-1" />
                  AI-Powered Career Enhancement
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                    Smart Career AI
                  </span>
                  <br />
                  <span className="text-foreground">
                    Your AI Career Assistant
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your GitHub repositories into professional documentation and optimize your resume with cutting-edge AI technology. Boost your career prospects with intelligent analysis and optimization.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/analyze">
                    <GitBranch className="mr-2 h-5 w-5" />
                    Analyze Repository
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-semibold">
                  <Link href="/resume-analyzer">
                    <Upload className="mr-2 h-5 w-5" />
                    Optimize Resume
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 border-2 border-background" />
                  </div>
                  <span className="text-sm text-muted-foreground">Trusted by 10,000+ professionals</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border">
                <div className="absolute inset-0 p-6 overflow-hidden">
                  <div className="h-8 w-full bg-muted rounded-lg flex items-center px-4 mb-6 space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <div className="ml-4 text-xs text-muted-foreground">Smart Career AI Dashboard</div>
                  </div>
                  
                  <div className="space-y-4 animate-pulse-slow">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg" />
                      <div className="h-6 w-16 bg-green-500/20 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-4">
                        <div className="h-4 w-20 bg-blue-500/30 rounded mb-2" />
                        <div className="h-6 w-12 bg-blue-500/40 rounded" />
                      </div>
                      <div className="h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-4">
                        <div className="h-4 w-16 bg-purple-500/30 rounded mb-2" />
                        <div className="h-6 w-14 bg-purple-500/40 rounded" />
                      </div>
                    </div>
                    
                    <div className="h-32 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-lg p-4">
                      <div className="h-4 w-32 bg-indigo-500/30 rounded mb-3" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-indigo-500/20 rounded" />
                        <div className="h-3 w-4/5 bg-indigo-500/20 rounded" />
                        <div className="h-3 w-3/4 bg-indigo-500/20 rounded" />
                      </div>
                    </div>
                    
                    <div className="h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"> Accelerate Your Career</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive AI-powered platform provides all the tools you need to showcase your projects professionally and optimize your job applications for maximum impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Professional README Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Transform your GitHub repositories into professional documentation with AI-generated README files, complete with badges, installation guides, and usage examples.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Auto-generated sections
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional badges
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Code examples
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">LinkedIn Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create compelling LinkedIn project descriptions that highlight your technical achievements and attract recruiters with optimized keywords.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Recruiter-friendly format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Keyword optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Achievement highlights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                  <FileCode className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Resume Project Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Generate resume-ready project descriptions that showcase your technical skills, impact, and accomplishments in a format that impresses hiring managers.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Impact-focused descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Technical skill highlights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quantified achievements
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">ATS Resume Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Analyze your resume for ATS compatibility with detailed scoring, field analysis, and get an optimized version that passes through applicant tracking systems.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    ATS compatibility score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Field-by-field analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Optimized resume download
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Smart Career AI Works</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform analyzes your projects and resume to create professional documentation and optimization recommendations in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold">Upload & Analyze</h3>
              <p className="text-muted-foreground">
                Provide your GitHub repository URL or upload your resume PDF. Our AI instantly begins analyzing your content.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Processing</h3>
              <p className="text-muted-foreground">
                Advanced AI algorithms analyze your code, commit history, project structure, and resume content to understand your skills and achievements.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive professional documentation, optimized descriptions, ATS scores, and actionable recommendations to boost your career prospects.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Powered by Advanced AI Technology
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our platform uses cutting-edge natural language processing and machine learning algorithms to understand your projects and career profile, generating content that resonates with both ATS systems and human recruiters.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">AI-Powered Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Career Growth</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-64 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6">
                  <div className="space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full" />
                      <div className="h-4 w-32 bg-blue-500/20 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-300/50 rounded" />
                      <div className="h-3 w-4/5 bg-gray-300/50 rounded" />
                      <div className="h-3 w-3/4 bg-gray-300/50 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-green-500/20 rounded-full" />
                      <div className="h-6 w-20 bg-blue-500/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-muted-foreground">Professionals Helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-muted-foreground">ATS Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-muted-foreground">More Interview Calls</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-muted-foreground">AI Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career with AI?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of professionals who have accelerated their careers with Smart Career AI. 
              Get professional documentation, optimize your resume, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-semibold bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/analyze">
                  <GitBranch className="mr-2 h-5 w-5" />
                  Analyze My Repository
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/resume-analyzer">
                  <Upload className="mr-2 h-5 w-5" />
                  Optimize My Resume
                </Link>
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              No credit card required • Free analysis • Instant results
            </p>
          </div>
        </div>
      </section>
    </>
  );
}