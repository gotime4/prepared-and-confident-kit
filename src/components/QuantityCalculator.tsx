
import { useState } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuantityCalculatorProps {
  defaultQuantity?: number;
  onChange: (quantity: number) => void;
  label?: string;
}

const QuantityCalculator = ({ 
  defaultQuantity = 1, 
  onChange,
  label = "Number of People" 
}: QuantityCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(defaultQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
      onChange(value);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="quantity" className="text-lg font-medium">
              {label}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleDecrease} 
              variant="outline" 
              className="h-10 w-10 p-0 rounded-full border border-gray-200"
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input 
              id="quantity"
              type="number" 
              className="h-10 text-center w-20" 
              value={quantity} 
              onChange={handleInputChange}
              min={1}
            />
            <Button 
              onClick={handleIncrease} 
              variant="outline" 
              className="h-10 w-10 p-0 rounded-full border border-gray-200"
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantityCalculator;
