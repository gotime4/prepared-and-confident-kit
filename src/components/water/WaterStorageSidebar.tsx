
import React from "react";
import QuantityCalculator from "@/components/QuantityCalculator";
import { Card, CardContent } from "@/components/ui/card";

interface WaterStorageSidebarProps {
  peopleCount: number;
  days: number;
  onPeopleChange: (newCount: number) => void;
  onDaysChange: (newDays: number) => void;
}

const WaterStorageSidebar = ({ 
  peopleCount, 
  days, 
  onPeopleChange,
  onDaysChange
}: WaterStorageSidebarProps) => {
  const GALLONS_PER_DAY = 1;
  
  const calculateWaterNeeds = () => {
    return peopleCount * days * GALLONS_PER_DAY;
  };

  return (
    <div className="lg:col-span-1">
      <div className="space-y-6 sticky top-24">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <QuantityCalculator 
                defaultQuantity={peopleCount} 
                onChange={onPeopleChange}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                  Days of Supply
                </label>
                <select 
                  id="days"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2"
                  value={days}
                  onChange={(e) => onDaysChange(parseInt(e.target.value))}
                >
                  <option value="3">3 days (72 hours)</option>
                  <option value="7">7 days (1 week)</option>
                  <option value="14">14 days (2 weeks)</option>
                  <option value="30">30 days (1 month)</option>
                  <option value="90">90 days (3 months)</option>
                  <option value="180">180 days (6 months)</option>
                  <option value="365">365 days (1 year)</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Water Needed:</span>
                  <span className="text-2xl font-bold text-blue-600">{calculateWaterNeeds()} gallons</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Based on 1 gallon per person per day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
          <h3 className="text-sm font-medium text-sky-800 mb-2">Water Storage Tips</h3>
          <ul className="text-sm text-sky-700 space-y-2 list-disc pl-5">
            <li>Store water in a cool, dark place away from sunlight</li>
            <li>Rotate stored water every 6-12 months</li>
            <li>Don't store water containers directly on concrete</li>
            <li>Keep a water filter or purification tablets accessible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaterStorageSidebar;
