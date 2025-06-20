"use client";

import Link from "next/link";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Smart Career AI
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/analyze" className="text-sm font-medium transition-colors hover:text-primary">
            Repository Analyzer
          </Link>
          <Link href="/resume-analyzer" className="text-sm font-medium transition-colors hover:text-primary">
            Resume Optimizer
          </Link>
          <Link href="/mock-interview" className="text-sm font-medium transition-colors hover:text-primary">
            Mock Interview
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/Home"
            />
          </SignedIn>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/analyze" className="text-lg font-medium transition-colors hover:text-primary">
                  Repository Analyzer
                </Link>
                <Link href="/resume-analyzer" className="text-lg font-medium transition-colors hover:text-primary">
                  Resume Optimizer
                </Link>
                <Link href="/mock-interview" className="text-lg font-medium transition-colors hover:text-primary">
                  Mock Interview
                </Link>
                <SignedOut>
                  <SignInButton>
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "shadow-xl",
                        userPreviewMainIdentifier: "font-semibold",
                      },
                    }}
                    afterSignOutUrl="/Home"
                  />
                </SignedIn>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}