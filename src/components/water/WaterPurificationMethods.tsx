
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PurificationMethod {
  title: string;
  description: string;
  effectiveness: string;
}

interface WaterPurificationMethodsProps {
  purificationMethods: PurificationMethod[];
}

const WaterPurificationMethods = ({ purificationMethods }: WaterPurificationMethodsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Purification Methods</CardTitle>
        <CardDescription>
          How to make water safe for drinking in emergency situations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purificationMethods.map((method, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{method.description}</p>
              <p className="text-xs bg-blue-50 text-blue-600 p-2 rounded">
                <span className="font-medium">Effectiveness:</span> {method.effectiveness}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterPurificationMethods;
