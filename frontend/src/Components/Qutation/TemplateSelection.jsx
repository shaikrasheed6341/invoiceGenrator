import React from "react";
import { useNavigate } from "react-router-dom";

const TemplateSelection = ({ onTemplateSelect }) => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      name: "Standard Template",
      description: "Clean and professional design",
      preview: "/invoice.png",
      features: ["Company header", "Itemized list", "Bank details", "Terms & conditions"]
    },
    {
      id: 2,
      name: "Modern Template",
      description: "Contemporary design with enhanced styling",
      preview: "/page1.jpg",
      features: ["Enhanced styling", "Better typography", "Improved layout", "Professional look"]
    }
  ];

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-4xl p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
            Select Invoice Template
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Choose a template for your quotation
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="text-center mb-4">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-bold text-zinc-800 mb-2">{template.name}</h3>
                <p className="text-sm text-zinc-600 mb-4">{template.description}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-800 text-sm">Features:</h4>
                <ul className="space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="text-xs text-zinc-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full mt-4 bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1">
                Select Template
              </button>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-zinc-600 font-medium py-3 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection; 