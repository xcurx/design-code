"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  parallaxOn?: boolean;
  hoverDuration?: number;
}

export default function TargetCursor({
  spinDuration = 2,
  hideDefaultCursor = false,
  parallaxOn = false,
  hoverDuration = 0.2,
}: TargetCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = "none";
    }

    const moveCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); // offset by half the size
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.classList.contains("cursor-target") || 
        target.closest(".cursor-target") ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      if (hideDefaultCursor) {
        document.body.style.cursor = "auto";
      }
    };
  }, [cursorX, cursorY, hideDefaultCursor]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.8 : 0.4,
          rotate: isHovered ? 45 : 0,
        }}
        transition={{ duration: hoverDuration }}
        className="relative flex h-8 w-8 items-center justify-center"
      >
        {/* Outer targeting bracket */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-white opacity-80" />
          <div className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-white opacity-80" />
          <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white opacity-80" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-white opacity-80" />
        </motion.div>
        
        {/* Inner dot */}
        <motion.div 
          animate={{ 
            scale: isHovered ? 0 : 1,
            opacity: isHovered ? 0 : 1
          }}
          className="h-1.5 w-1.5 rounded-full bg-white transition-opacity" 
        />
      </motion.div>
    </motion.div>
  );
}
