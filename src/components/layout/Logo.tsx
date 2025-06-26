import React from 'react';
import { Shield, Eye } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <Shield className="h-8 w-8 text-blue-800" />
        <Eye className="h-4 w-4 absolute text-orange-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="ml-2 flex flex-col">
        <span className="text-xl font-bold text-blue-900">Visible</span>
        <span className="text-xs font-medium text-orange-600 -mt-1">Governance</span>
      </div>
    </div>
  );
};

export default Logo;