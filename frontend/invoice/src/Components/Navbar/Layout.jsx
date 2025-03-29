import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-tr from-zinc-600 to-zinc-900">{children}</main>
    </div>
  );
};

export default Layout;