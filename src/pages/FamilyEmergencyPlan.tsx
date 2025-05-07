import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Flame, Globe, PhoneCall, MapPin, CheckSquare, AlertCircle, Shield } from "lucide-react";

const FamilyEmergencyPlan = () => {
  return (
    <div className="bg-[#f5f8fa] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mt-20 mb-8 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1503252947848-7338d3f92f31?auto=format&fit=crop&w=800&q=80"
              alt="Family prepared for emergencies"
              className="w-full h-64 object-cover object-center"
              style={{ background: '#f5f8fa' }}
            />
          </div>
          
          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Family Emergency Plan</h1>
          <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
            Create a comprehensive emergency plan for your family to ensure everyone knows what to do
            in various emergency situations. Use this guide to develop, document, and practice your plan.
          </p>
          
          {/* Introduction Box */}
          <div className="bg-blue-50 rounded-xl p-6 flex items-start gap-4 mb-8 shadow-sm border border-blue-100">
            <span className="bg-blue-100 rounded-full p-3 flex items-center justify-center">
              <Shield className="w-7 h-7 text-blue-500" />
            </span>
            <div>
              <h2 className="font-bold text-lg mb-1 text-gray-900">Why Have a Family Emergency Plan?</h2>
              <p className="text-gray-800 text-base">
                A well-prepared family can respond quickly and effectively during emergencies. Your plan ensures 
                everyone knows their role, where to go, and how to communicate when disaster strikes.
              </p>
            </div>
          </div>
          
          {/* Emergency Types Section */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Emergency Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center mb-3">
                <Flame className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-red-600">Fire</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Identify two exits per room</li>
                <li>Assign a fire extinguisher location</li>
                <li>Test smoke alarms monthly</li>
                <li>Create a family evacuation route</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center mb-3">
                <Globe className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-amber-600">Earthquake</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Secure heavy furniture</li>
                <li>Create a "drop, cover, hold on" drill</li>
                <li>Identify safe zones in each room</li>
                <li>Know how to shut off utilities</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center mb-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-600">Cyber Attack</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Back up important files</li>
                <li>Avoid phishing emails</li>
                <li>Store printed copies of key documents</li>
                <li>Use strong, unique passwords</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center mb-3">
                <Shield className="h-6 w-6 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-emerald-600">Severe Weather</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Identify safe shelter locations</li>
                <li>Have weather radio with batteries</li>
                <li>Store emergency water and food</li>
                <li>Prepare for power outages</li>
              </ul>
            </div>
          </div>
          
          {/* Communication Plan */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Communication Plan</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center mb-4">
              <PhoneCall className="h-6 w-6 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold">Establish reliable communication channels</h3>
            </div>
            <ul className="list-disc pl-5 space-y-3 text-gray-700">
              <li>Choose a primary and backup out-of-area emergency contact</li>
              <li>Make wallet-size cards with these contacts for each family member</li>
              <li>Agree on how to check in (e.g., text first, then call)</li>
              <li>Consider using emergency contact apps or group messaging services</li>
              <li>Practice your communication plan during family drills</li>
            </ul>
          </div>
          
          {/* Meeting Locations */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Meeting Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-blue-500 mb-2">1</span>
              <h3 className="font-semibold text-gray-900 mb-1">Near Home</h3>
              <p className="text-gray-700 text-base">Neighbor's driveway or nearby park. Choose a spot that's easily accessible and known to all family members.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-blue-500 mb-2">2</span>
              <h3 className="font-semibold text-gray-900 mb-1">Outside Neighborhood</h3>
              <p className="text-gray-700 text-base">Church building, school, or a friend's home. This location should be outside your immediate area in case evacuation is necessary.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:col-span-2">
              <span className="text-2xl font-bold text-blue-500 mb-2">3</span>
              <h3 className="font-semibold text-gray-900 mb-1">Regional Evacuation Site</h3>
              <p className="text-gray-700 text-base">Community center, library, or designated emergency shelter. Know the evacuation routes to reach this location from your home, work, and school.</p>
            </div>
          </div>
          
          {/* Tip Box */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 mb-8 border border-blue-100">
            <span className="bg-blue-100 rounded-full p-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
            <span className="text-blue-900 text-base">It's recommended to write or print your meeting locations and keep them with your emergency supplies.</span>
          </div>
          
          {/* Checklist & Review */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Checklist & Review</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center mb-4">
              <CheckSquare className="h-6 w-6 text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold">Maintain and practice your plan</h3>
            </div>
            <ul className="list-disc pl-5 space-y-3 text-gray-700">
              <li>Review the plan monthly with the family</li>
              <li>Practice fire, earthquake, and contact drills quarterly</li>
              <li>Keep a printed copy in each 72-hour kit and car</li>
              <li>Teach kids how and when to dial 911</li>
              <li>Update emergency contact information as needed</li>
            </ul>
          </div>
          
          {/* Taking Action */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Taking Action</h2>
            <p className="mb-4 text-gray-800">
              The best emergency plan is one that your family understands and can follow without hesitation.
              Set aside time this week to create your plan, gather necessary supplies, and conduct your first drill.
            </p>
            <p className="text-gray-800">
              Remember to update your plan whenever there are significant changes to your family situation,
              home environment, or when you learn new information about emergency preparedness.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FamilyEmergencyPlan;
