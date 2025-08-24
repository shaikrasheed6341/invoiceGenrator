import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, Users, Package, FileText, ArrowRight } from 'lucide-react';

const OnboardingFlow = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "Business Profile",
      description: "Set up your company details, GST, and address information",
      action: "Complete Profile",
      route: "/submitownerdata"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Add Customers",
      description: "Register your customers with their contact and business details",
      action: "Add Customers",
      route: "/postcustmer"
    },
    {
      icon: <Package className="w-8 h-8 text-purple-600" />,
      title: "Manage Products",
      description: "Create and organize your product catalog with pricing",
      action: "Add Products",
      route: "/selectiteams"
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Create Quotations",
      description: "Generate professional quotes and invoices for your customers",
      action: "Create Quote",
      route: "/create-quotation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to ITPARTNER! 🎉
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto">
            Let's get your business set up and running. Follow these steps to unlock the full power of your invoice management system.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {step.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">
                      {index + 1}. {step.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  {step.description}
                </p>
                <Button 
                  onClick={() => navigate(step.route)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🚀 Ready to get started?
                </h3>
                <p className="text-blue-700 mb-4">
                  Begin with your business profile - it's the foundation for everything else!
                </p>
                <Button 
                  onClick={() => navigate("/submitownerdata")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Start with Business Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
