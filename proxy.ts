import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function proxy(req) {
    const pathname = req.nextUrl.pathname;
    const session = req.auth;

    if (!session && pathname !== "/sign-in") {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    if (session && pathname === "/sign-in") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/", "/sign-in"],
}