import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo() {
  const words = ["better", "cute", "beautiful", "modern"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div
        className="text-4xl mx-auto font-normal text-neutral-400 ">
        Build
        <FlipWords words={words} /> <br />
        invoices with ITPARTNER
      </div>
    </div>
  );
}
