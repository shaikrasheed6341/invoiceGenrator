import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, User, Mail, Phone, Landmark, MapPin, Edit } from 'lucide-react';

const BusinessDetailsCard = ({ ownerData, onEdit }) => {
  // Helper function to format and validate data
  const formatValue = (value) => {
    if (!value || value === 'na' || value === 'NA' || value === '') {
      return 'Not provided';
    }
    return value;
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      window.location.href = '/updateowner';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-zinc-900">Business Details</CardTitle>
              <p className="text-sm text-zinc-500 mt-1">Your company information</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="success" className="text-xs">Active</Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEdit}
              className="border-zinc-200 hover:bg-zinc-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailItem 
            label="Business Name" 
            value={formatValue(ownerData.compneyname)}
            icon={<Building2 className="w-4 h-4" />}
          />
          <DetailItem 
            label="Owner Name" 
            value={formatValue(ownerData.name)}
            icon={<User className="w-4 h-4" />}
          />
          <DetailItem 
            label="Email Address" 
            value={formatValue(ownerData.email)}
            icon={<Mail className="w-4 h-4" />}
          />
          <DetailItem 
            label="Phone Number" 
            value={formatValue(ownerData.phone)}
            icon={<Phone className="w-4 h-4" />}
          />
          <DetailItem 
            label="GST Number" 
            value={formatValue(ownerData.gstNumber)}
            icon={<Landmark className="w-4 h-4" />}
          />
          <DetailItem 
            label="Business Address" 
            value={formatValue(ownerData.address)}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <Card className="border border-zinc-100 bg-white hover:shadow-md transition-all duration-200 group">
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors duration-200">
            <div className="text-zinc-600">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
          <p className="text-sm font-semibold text-zinc-900 break-words leading-relaxed">
            {value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default BusinessDetailsCard; 