import React, { useState } from "react";
import TemplateSelection from "./TemplateSelection";
import OwnerSelection from "./OwnerSelection";
import PostQuotation from "./Postquation";

const CreateQuotationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep(2);
  };

  const handleOwnerSelect = (owner) => {
    setSelectedOwner(owner);
    setCurrentStep(3);
  };

  const handleBackToTemplate = () => {
    setSelectedTemplate(null);
    setSelectedOwner(null);
    setCurrentStep(1);
  };

  const handleBackToOwner = () => {
    setSelectedOwner(null);
    setCurrentStep(2);
  };

  const renderStepIndicator = () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 bg-gray-100'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Template</span>
          </div>
          
          <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 bg-gray-100'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Owner</span>
          </div>
          
          <div className={`w-8 h-1 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 bg-gray-100'
            }`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Quotation</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <TemplateSelection onTemplateSelect={handleTemplateSelect} />;
      case 2:
        return (
          <OwnerSelection 
            selectedTemplate={selectedTemplate}
            onOwnerSelect={handleOwnerSelect}
          />
        );
      case 3:
        return (
          <PostQuotation 
            selectedTemplate={selectedTemplate}
            selectedOwner={selectedOwner}
            onBack={handleBackToOwner}
          />
        );
      default:
        return <TemplateSelection onTemplateSelect={handleTemplateSelect} />;
    }
  };

  return (
    <div className="relative">
      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
};

export default CreateQuotationFlow; 