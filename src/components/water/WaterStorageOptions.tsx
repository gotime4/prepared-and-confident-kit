
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplets } from "lucide-react";

interface WaterMethod {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

interface WaterStorageOptionsProps {
  waterMethods: WaterMethod[];
}

const WaterStorageOptions = ({ waterMethods }: WaterStorageOptionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Storage Options</CardTitle>
        <CardDescription>
          Comparison of different water storage methods for emergency preparedness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {waterMethods.map((method, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
              <h3 className="text-lg font-medium flex items-center">
                <Droplets className="h-5 w-5 text-sky-500 mr-2" />
                {method.title}
              </h3>
              <p className="mt-1 text-gray-600">{method.description}</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Advantages</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    {method.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    {method.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Recommendation:</span> {method.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterStorageOptions;
