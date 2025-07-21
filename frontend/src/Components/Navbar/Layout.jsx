import React from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import AuthenticatedLayout from "./AuthenticatedLayout";

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If authenticated, show sidebar layout
  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  // If not authenticated, show top navbar layout
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-tr from-zinc-600 to-zinc-900">{children}</main>
    </div>
  );
};

export default Layout;