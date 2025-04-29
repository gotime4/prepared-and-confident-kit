
import React from "react";

interface WaterStorageHeaderProps {
  title: string;
  description: string;
}

const WaterStorageHeader = ({ title, description }: WaterStorageHeaderProps) => {
  return (
    <div className="pt-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default WaterStorageHeader;
