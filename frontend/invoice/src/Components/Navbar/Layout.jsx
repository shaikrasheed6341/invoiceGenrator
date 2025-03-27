import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;