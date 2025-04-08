import React from "react";
import Landingpage from "../Landingpage/Landingpage";
import Card from "../Cards/Card";
import Footer from "./Footer";

const Dashboard = () => {
  return (
    
    <div className="flex flex-col  min-h-screen   w-full ">
    
      <div>
        <Landingpage />
      </div>
      <div className="flex-grow min-h-screen w-full ">
        <Card />
      </div>
      <div className="div">
        <Footer />
      </div>
      
    </div>
  );
};

export default Dashboard;