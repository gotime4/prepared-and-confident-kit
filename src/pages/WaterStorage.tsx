import { useState } from "react";
import { Droplets } from "lucide-react";
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
      
      <div className="w-full max-w-3xl mx-auto">
        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden mt-20 mb-8 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Water storage containers"
            className="w-full h-64 object-cover object-center"
            style={{ background: '#eaf6fb' }}
          />
        </div>
        {/* Title & Subtitle */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Water Storage for Emergencies</h1>
        <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
          Learn how to store, calculate, and purify water to keep your family safe in any situation.
        </p>
        {/* Info Box */}
        <div className="bg-sky-50 rounded-xl p-6 flex items-start gap-4 mb-8 shadow-sm border border-sky-100">
          <span className="bg-sky-100 rounded-full p-3 flex items-center justify-center">
            <Droplets className="w-7 h-7 text-sky-500" />
          </span>
          <div>
            <h2 className="font-bold text-lg mb-1 text-gray-900">Why Store Water?</h2>
            <p className="text-gray-800 text-base">
              Water is the most critical supply in an emergency. Store at least one gallon per person per day for drinking and sanitation. Plan for at least two weeks if possible.
            </p>
          </div>
        </div>
      </div>

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
              {/* Tip Box */}
              <div className="bg-sky-50 rounded-xl p-4 flex items-center gap-3 mt-10 border border-sky-100">
                <span className="bg-sky-100 rounded-full p-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-sky-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                </span>
                <span className="text-sky-900 text-base">Rotate your stored water every 6-12 months and keep purification supplies on hand for added safety.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WaterStorage;
