import React from "react";
import { cn } from "../../lib/utils";
import { Spotlight } from "../ui/Spotlight";
import { FlipWordsDemo } from "./FlipWordsDemo";
export function SpotlightPreview() {
  return (
    <div
      className="relative flex h-[30rem] w-full overflow-hidden antialiased md:items-center md:justify-center">
      <div
        className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none" />
      <Spotlight className="-top-20 left-0 md:-top-10 md:left-60" fill="white" />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-10 md:pt-0">
             
          <FlipWordsDemo />
        
        
      </div>
    </div>
  );
}
