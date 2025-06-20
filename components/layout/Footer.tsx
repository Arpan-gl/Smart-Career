import Link from "next/link";
import { Brain, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Smart Career AI
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered career enhancement platform that transforms your GitHub repositories, optimizes your resume, and helps you practice interviews for better job opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/analyze" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Repository Analyzer
                </Link>
              </li>
              <li>
                <Link href="/resume-analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resume Optimizer
                </Link>
              </li>
              <li>
                <Link href="/mock-interview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mock Interview
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn Generator
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ATS Analysis
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Career Tips Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Smart Career AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}