
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaterStorageHeader from "@/components/water/WaterStorageHeader";
import WaterStorageSidebar from "@/components/water/WaterStorageSidebar";
import WaterStorageOptions from "@/components/water/WaterStorageOptions";
import WaterPurificationMethods from "@/components/water/WaterPurificationMethods";
import WaterStorageFAQs from "@/components/water/WaterStorageFAQs";
import { waterMethods, purificationMethods } from "@/data/waterStorageData";

const WaterStorage = () => {
  const [peopleCount, setPeopleCount] = useState(1);
  const [days, setDays] = useState(14);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <WaterStorageHeader 
        title="Water Storage Guide" 
        description="Clean water is your most essential resource in an emergency. Learn how to store and purify water for your family."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <WaterStorageSidebar 
            peopleCount={peopleCount}
            days={days}
            onPeopleChange={setPeopleCount}
            onDaysChange={setDays}
          />
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <WaterStorageOptions waterMethods={waterMethods} />
              <WaterPurificationMethods purificationMethods={purificationMethods} />
              <WaterStorageFAQs />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WaterStorage;
