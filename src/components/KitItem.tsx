
import { useState } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export interface KitItemProps {
  id: string;
  name: string;
  quantity: number;
  personMultiplier?: number;
  category: string;
  description?: string;
  isRemovable?: boolean;
  onRemove?: (id: string) => void;
  onToggle?: (id: string, checked: boolean) => void;
}

const KitItem = ({
  id,
  name,
  quantity,
  personMultiplier = 1,
  category,
  description,
  isRemovable = false,
  onRemove,
  onToggle
}: KitItemProps) => {
  const [checked, setChecked] = useState(false);

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
    if (onToggle) {
      onToggle(id, checked);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <Card className={`border-l-4 ${checked ? 'border-l-green-500 bg-green-50/30' : 'border-l-gray-200'} transition-colors duration-200`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id={`item-${id}`} 
              checked={checked}
              onCheckedChange={handleCheckChange}
              className="mt-1.5"
            />
            <div>
              <label 
                htmlFor={`item-${id}`}
                className={`text-base font-medium block ${checked ? 'line-through text-gray-500' : 'text-gray-900'}`}
              >
                {name} 
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {quantity > 1 && `(${quantity})`}
                </span>
              </label>
              
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {isRemovable && onRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
              onClick={handleRemove}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KitItem;
