import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />

      {/* Grid Background (Behind Everything) */}
      <div
        className="absolute inset-0  bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"
      ></div>

      {/* Radial Glow Background (Above Grid, Below Content) */}
      <div
        className="absolute left-1/2 top-[10%] h-[800px] w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-full z-[-1] bg-[radial-gradient(circle,rgba(255,255,255,0.4) 10%,rgba(0,0,0,0) 60%)] opacity-40 blur-3xl pointer-events-none"
      ></div>
    </div>
  );
};

export default Layout;
