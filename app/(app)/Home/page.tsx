import Link from "next/link";
import { ArrowRight, FileCode, Linkedin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10" />
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
        </div>
        <div className="container relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Turn GitHub repos into{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  professional summaries
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                GitAnalyzer AI transforms your repositories into polished documentation, LinkedIn summaries, and resume-ready project descriptions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/analyze">
                    Analyze My Repository
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl bg-card">
              <div className="absolute inset-0 p-4 overflow-hidden">
                <div className="h-8 w-full bg-muted rounded-md flex items-center px-4 mb-4 space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="ml-2 text-xs text-muted-foreground">GitAnalyzer AI</div>
                </div>
                <div className="animate-pulse-slow">
                  <div className="h-8 w-3/4 bg-muted/60 rounded mb-3" />
                  <div className="h-4 w-full bg-muted/60 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-muted/60 rounded mb-2" />
                  <div className="h-4 w-4/6 bg-muted/60 rounded mb-6" />
                  <div className="h-20 w-full bg-muted/40 rounded mb-4" />
                  <div className="h-4 w-full bg-muted/60 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-muted/60 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-muted/60 rounded mb-6" />
                  <div className="h-32 w-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Transform Your GitHub Repositories</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered tools analyze your code, commit history, and project structure to create professional documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">README Generator</h3>
              <p className="text-muted-foreground mb-4">
                Create professional README.md files with proper sections, badges, and documentation.
              </p>
              <div className="mt-auto pt-4">
                <Button variant="ghost" size="sm" className="gap-1 text-sm">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Linkedin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">LinkedIn Summary</h3>
              <p className="text-muted-foreground mb-4">
                Generate professional project descriptions optimized for your LinkedIn profile.
              </p>
              <div className="mt-auto pt-4">
                <Button variant="ghost" size="sm" className="gap-1 text-sm">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resume Generator</h3>
              <p className="text-muted-foreground mb-4">
                Create resume-ready project descriptions highlighting your technical skills and accomplishments.
              </p>
              <div className="mt-auto pt-4">
                <Button variant="ghost" size="sm" className="gap-1 text-sm">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to showcase your projects?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get started with GitAnalyzer AI today and transform your GitHub repositories into professional documentation.
            </p>
            <Button asChild size="lg" className="font-semibold">
              <Link href="/analyze">
                Analyze My Repository
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}