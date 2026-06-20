"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 31;
const FRAME_PREFIX = "/frames/ezgif-frame-";
const FRAME_SUFFIX = ".webp";

export default function BoxSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
      const handleLoad = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Setup GSAP Animation
  useEffect(() => {
    // Only initialize when all frames are loaded
    if (loadedCount < FRAME_COUNT || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a matchMedia block to ensure ScrollTrigger plays nicely with React StrictMode
    let ctxGsap = gsap.context(() => {
      // Set canvas dimensions based on the first image
      const firstImg = images[0];
      if (firstImg.width && firstImg.height) {
        canvas.width = firstImg.width;
        canvas.height = firstImg.height;
        // Draw first frame immediately
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(firstImg, 0, 0);
      }

      const frameObj = { frame: 0 };

      const render = () => {
        if (!ctx || !images[frameObj.frame]) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frameObj.frame], 0, 0);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // The animation takes 2 screen heights to complete
          scrub: 0.5,    // Smooth scrubbing
          pin: true,     // Pin the container so the canvas stays in place
          anticipatePin: 1,
        },
      });

      tl.to(frameObj, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
      });
    }, containerRef);

    return () => ctxGsap.revert(); // Cleanup
  }, [loadedCount, images]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="absolute top-20 left-0 w-full text-center z-10 px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          Unbox your potential
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          Scroll down to discover how TransitIQ handles the heavy lifting of logistics.
        </p>
      </div>

      <div className="relative w-full max-w-4xl flex items-center justify-center mt-32 px-6">
        <canvas
          ref={canvasRef}
          className="w-full max-w-2xl h-auto object-contain"
        />
        
        {loadedCount < FRAME_COUNT && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-400">Loading Animation...</p>
          </div>
        )}
      </div>
    </div>
  );
}
