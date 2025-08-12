import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo() {
  const words = [  "Billing System","Data Encryption","Data Security","Full Privacy","Quotation Builder"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div
        className="text-5xl mx-auto font-bold text-white   ">
        Modern
        <FlipWords words={words}  /> <br />
         with Itpartner
      </div>
    </div>
  );
}
