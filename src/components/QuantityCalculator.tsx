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
  value: number; // Add value prop to make this a controlled component
}

const QuantityCalculator = ({ 
  onChange,
  label = "Number of People",
  value = 1  // Use value instead of internal state
}: QuantityCalculatorProps) => {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1) {
      onChange(newValue);
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
              disabled={value <= 1}
            >
              -
            </Button>
            <Input 
              id="quantity"
              type="number" 
              className="h-10 text-center w-20" 
              value={value} 
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
