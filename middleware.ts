import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/Home"
]);

export default clerkMiddleware(async (auth,req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);
    const isAccessingHomePage = currentUrl.pathname === "/Home";

    if(userId && isPublicRoute(req) && !isAccessingHomePage){
        return NextResponse.redirect(new URL("/Home",req.url));
    }

    if(!userId){
        if(!isPublicRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
  matcher:["/((?!.*\\..*|_next).*)" , "/" , "/(api|trpc)(.*)"],
}