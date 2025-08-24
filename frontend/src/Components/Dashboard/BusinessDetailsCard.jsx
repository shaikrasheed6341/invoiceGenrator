import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { Badge } from '../ui/badge';
import { Building2, User, Mail, Phone, Landmark, MapPin } from 'lucide-react';

const BusinessDetailsCard = ({ ownerData }) => {
  // Helper function to format and validate data
  const formatValue = (value) => {
    if (!value || value === 'na' || value === 'NA' || value === '') {
      return 'Not provided';
    }
    return value;
  };



  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-zinc-50/50 to-white overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/30 via-transparent to-zinc-100/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-zinc-900 font-bold">Business Details</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">Your company information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="success" className="text-xs font-medium">Active</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <DetailItem 
              label="Business Name" 
              value={formatValue(ownerData.compneyname)}
              icon={<Building2 className="w-3 h-3" />}
            />
            <DetailItem 
              label="Owner Name" 
              value={formatValue(ownerData.name)}
              icon={<User className="w-3 h-3" />}
            />
            <DetailItem 
              label="Email Address" 
              value={formatValue(ownerData.email)}
              icon={<Mail className="w-3 h-3" />}
            />
            <DetailItem 
              label="Phone Number" 
              value={formatValue(ownerData.phone)}
              icon={<Phone className="w-3 h-3" />}
            />
            <DetailItem 
              label="GST Number" 
              value={formatValue(ownerData.gstNumber)}
              icon={<Landmark className="w-3 h-3" />}
            />
            <DetailItem 
              label="Recipient Name" 
              value={formatValue(ownerData.recipientName)}
              icon={<User className="w-3 h-3" />}
            />
            <DetailItem 
              label="House/Flat Number" 
              value={formatValue(ownerData.houseNumber)}
              icon={<MapPin className="w-3 h-3" />}
            />
            <DetailItem 
              label="Street Name" 
              value={formatValue(ownerData.streetName)}
              icon={<MapPin className="w-3 h-3" />}
            />
            <DetailItem 
              label="Locality/Area" 
              value={formatValue(ownerData.locality)}
              icon={<MapPin className="w-3 h-3" />}
            />
            <DetailItem 
              label="City" 
              value={formatValue(ownerData.city)}
              icon={<MapPin className="w-3 h-3" />}
            />
            <DetailItem 
              label="PIN Code" 
              value={formatValue(ownerData.pinCode)}
              icon={<MapPin className="w-3 h-3" />}
            />
            <DetailItem 
              label="State" 
              value={formatValue(ownerData.state)}
              icon={<MapPin className="w-3 h-3" />}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <Card className="border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
    <CardContent className="p-3">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-lg flex items-center justify-center group-hover:from-zinc-200 group-hover:to-zinc-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
            <div className="text-zinc-600 group-hover:text-zinc-700 transition-colors duration-300">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wide">{label}</p>
          <p className="text-xs font-semibold text-zinc-900 break-words leading-relaxed">
            {value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default BusinessDetailsCard; 