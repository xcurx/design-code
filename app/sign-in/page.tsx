"use client";

import { signIn } from "next-auth/react";
import { Code2, Sparkles, Layout, Cpu, Database, Network } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("./Antigravity"), { ssr: false });

export default function SignIn() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = containerRef.current?.clientHeight ?? 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      id="signin-container"
      className="flex min-h-screen relative overflow-hidden bg-background text-foreground items-center justify-center p-6"
      ref={containerRef}
    >
      {/* Full Page Antigravity 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-screen">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#8b5cf6" // Primary tint for particles
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      {/* Full Page Cursor Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 lg:opacity-100 z-10"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.05), transparent 40%)`
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col gap-12 lg:gap-16">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center gap-4 text-center transition-transform duration-500 ease-out hover:scale-[1.02]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lg backdrop-blur-md border border-primary/20">
            <Code2 className="h-10 w-10 text-primary" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-foreground">DesignCode</span>
          <p className="text-muted-foreground max-w-md">Practice | Design | Excel</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto w-full">
          {/* Glassmorphism Quote Card (Left side on desktop) */}
          <div className="group relative rounded-3xl border border-border/50 bg-background/50 p-8 lg:p-10 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-500 hover:bg-background/80 hover:-translate-y-1 hover:border-primary/20 order-2 lg:order-1 h-full flex flex-col justify-center">
             <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:rotate-12">
               <Sparkles className="size-32 text-primary" />
             </div>
             
             {/* Card Cursor Glow */}
             <div 
               className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
               style={{
                 background: `radial-gradient(400px circle at ${mousePosition.x - 48}px ${mousePosition.y - containerHeight / 2 + 100}px, rgba(139,92,246,0.08), transparent 40%)`
               }}
             />

             <blockquote className="text-xl lg:text-2xl leading-relaxed font-medium text-foreground relative z-10">
              &ldquo;Build UML diagrams,
              get AI-powered feedback, and level up your architecture skills instantly.&rdquo;
            </blockquote>
             <div className="mt-8 flex items-center gap-5 relative z-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                   <Cpu className="size-6 text-primary" />
                </div>
                <div>
                   <p className="text-base font-semibold text-foreground">AI-Powered System</p>
                   <p className="text-sm text-muted-foreground mt-0.5">Real-time architectural feedback</p>
                </div>
             </div>
          </div>

          {/* Auth Card (Right side on desktop) */}
           <div className="order-1 lg:order-2">
             <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-2xl relative overflow-hidden transition-all duration-300 hover:border-border hover:shadow-primary/10 h-full flex flex-col justify-center p-2">
                {/* Subtle card top gradient line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <CardHeader className="space-y-4 text-center pb-8 pt-6">
                  <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to your account to continue your architectural journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                   <button
                     onClick={() => signIn("google", { callbackUrl: "/" })}
                     className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-4 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-accent/50 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                   >
                     <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                       <path
                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                         fill="#4285F4"
                       />
                       <path
                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                         fill="#34A853"
                       />
                       <path
                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                         fill="#FBBC05"
                       />
                       <path
                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                         fill="#EA4335"
                       />
                     </svg>
                     Continue with Google
                     <div className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                   </button>
                </CardContent>
             </Card>
           </div>
        </div>

        {/* Footer info & Icons */}
        <div className="flex flex-col items-center gap-6 mt-4">
           <div className="flex gap-6 text-muted-foreground/60">
             <Layout className="size-5 transition-transform hover:scale-110 hover:text-foreground cursor-default" />
             <Network className="size-5 transition-transform hover:scale-110 hover:text-foreground cursor-default" />
             <Database className="size-5 transition-transform hover:scale-110 hover:text-foreground cursor-default" />
           </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our <a href="#" className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">Terms of Service</a> and <a href="#" className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">Privacy Policy</a>.
            </p>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DesignCode
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}