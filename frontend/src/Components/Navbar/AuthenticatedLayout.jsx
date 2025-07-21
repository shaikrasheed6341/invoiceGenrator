import React, { useState } from 'react';
import Sidebar from './Sidebar';

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-60'
      }`}>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout; 