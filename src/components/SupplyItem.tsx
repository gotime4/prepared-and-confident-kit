import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import InfoTooltip from "@/components/ui/InfoTooltip";

export interface SupplyItemProps {
  id: string;
  name: string;
  recommendedAmount: number;
  unit: string;
  category: string;
  onUpdateCurrentAmount: (id: string, amount: number) => void;
  currentAmount?: number;
  infoTooltip?: string;
}

const SupplyItem: React.FC<SupplyItemProps> = ({
  id,
  name,
  recommendedAmount,
  unit,
  category,
  onUpdateCurrentAmount,
  currentAmount = 0,
  infoTooltip
}) => {
  // Calculate progress based directly on props (no local state)
  const progress = Math.min(Math.floor((currentAmount / recommendedAmount) * 100), 100);
  
  // Status based on progress percentage
  const getStatus = () => {
    if (progress >= 100) return "Complete";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };
  
  // Progress bar color based on status
  const getProgressColor = () => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-sky-500";
    if (progress > 0) return "bg-amber-500";
    return "bg-gray-300";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 flex items-center">
          {name}
          <InfoTooltip label={`More info about ${name}`}>
            {infoTooltip}
          </InfoTooltip>
        </h3>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3 md:mt-0">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 min-w-[120px]">Recommended:</span>
          <span className="font-medium">{recommendedAmount} {unit}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 min-w-[120px]">What I Have:</span>
          <Input
            type="text"
            inputMode="decimal"
            value={currentAmount > 0 ? currentAmount.toString() : ''}
            // Direct approach - similar to kit page
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              onUpdateCurrentAmount(id, isNaN(newValue) ? 0 : newValue);
              console.log(`Direct update: Item ${id} set to ${isNaN(newValue) ? 0 : newValue}`);
            }}
            className="w-20 h-8 text-center"
            placeholder="0"
          />
          <span className="ml-1 text-gray-500">{unit}</span>
        </div>
      </div>
      
      <div className="mt-3 md:mt-0 md:ml-4 md:pl-4 md:border-l border-gray-200 flex flex-col w-full md:w-64">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Progress</span>
          <span className={`text-xs font-medium ${progress >= 100 ? 'text-green-500' : progress > 0 ? 'text-sky-600' : 'text-gray-500'}`}>
            {progress}%
          </span>
        </div>
        <Progress 
          value={progress} 
          className={`h-2 bg-gray-100 ${getProgressColor()}`}
        />
        <span className={`text-xs mt-1 self-end
          ${progress >= 100 ? 'text-green-500' : 
            progress > 30 ? 'text-sky-600' : 
            progress > 0 ? 'text-amber-500' : 'text-gray-500'}`
        }>
          {getStatus()}
        </span>
      </div>
    </div>
  );
};

export default SupplyItem;
