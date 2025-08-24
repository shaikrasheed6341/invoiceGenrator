import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import tokenManager from '../../utils/tokenManager';

const TokenInfo = () => {
  const tokenInfo = tokenManager.getTokenInfo();
  
  if (!tokenInfo) {
    return null;
  }

  const getStatusIcon = () => {
    if (tokenInfo.isExpired) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (tokenInfo.daysUntilExpiry <= 7) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    if (tokenInfo.isExpired) {
      return 'text-red-600';
    } else if (tokenInfo.daysUntilExpiry <= 7) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  };

  const getStatusText = () => {
    if (tokenInfo.isExpired) {
      return 'Expired';
    } else if (tokenInfo.daysUntilExpiry <= 7) {
      return 'Expires Soon';
    } else {
      return 'Valid';
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-zinc-600" />
          <CardTitle className="text-sm font-medium">Token Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Status:</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className={`text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Expires in:</span>
            <span className="text-xs font-medium text-zinc-700">
              {tokenInfo.daysUntilExpiry} days
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Expires on:</span>
            <span className="text-xs font-medium text-zinc-700">
              {tokenInfo.expiresAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenInfo;
