
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WaterStorageFAQs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Storage FAQs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">How much water should I store?</h3>
            <p className="text-gray-600 text-sm mt-1">
              At minimum, store one gallon per person per day for drinking and sanitation. 
              Aim for a two-week supply if possible, more for hot climates or for people with special needs.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">How long can I store water?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Commercially bottled water can be stored for 1-2 years. Home-filled containers should be rotated every six months.
              Proper storage conditions (cool, dark) can extend shelf life.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">What containers are safe for water storage?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Use food-grade containers made of high-density polyethylene (HDPE) marked with a recycling symbol #2.
              Never use containers that previously held toxic chemicals.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Should I treat water before storage?</h3>
            <p className="text-gray-600 text-sm mt-1">
              Municipal tap water has already been treated and is ready for storage.
              For extra protection, add 2 drops of unscented household bleach (5-6% sodium hypochlorite) per gallon.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterStorageFAQs;
