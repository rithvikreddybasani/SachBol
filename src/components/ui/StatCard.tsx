import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, trend, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105 duration-300">
      <div className="flex items-start">
        <div className="mr-4">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className={`flex items-center mt-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;