import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Globe, PhoneCall, MapPin, CheckSquare } from "lucide-react";

const FamilyEmergencyPlan = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-slate-50 pt-28 pb-12">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Family Emergency Plan</h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Create a comprehensive emergency plan for your family to ensure everyone knows what to do
              in various emergency situations. Use this guide to develop, document, and practice your plan.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emergency Types */}
            <Card className="shadow-md">
              <CardHeader className="bg-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-red-500" />
                  <CardTitle>Emergency Types</CardTitle>
                </div>
                <CardDescription>
                  Prepare for specific emergency scenarios with these guidelines
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Fire</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Identify two exits per room</li>
                      <li>Assign a fire extinguisher location</li>
                      <li>Test smoke alarms monthly</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-600 mb-2">Earthquake</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Secure heavy furniture</li>
                      <li>Create a "drop, cover, hold on" drill</li>
                      <li>Identify safe zones in each room</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Cyber Attack</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Back up important files</li>
                      <li>Avoid phishing emails</li>
                      <li>Store printed copies of key documents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communication Plan */}
            <Card className="shadow-md">
              <CardHeader className="bg-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneCall className="h-6 w-6 text-green-500" />
                  <CardTitle>Communication Plan</CardTitle>
                </div>
                <CardDescription>
                  Establish reliable ways to communicate during emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-3">
                  <li>Choose a primary and backup out-of-area emergency contact</li>
                  <li>Make wallet-size cards with these contacts for each family member</li>
                  <li>Agree on how to check in (e.g., text first, then call)</li>
                  <li>Consider using emergency contact apps or group messaging services</li>
                </ul>
              </CardContent>
            </Card>

            {/* Meeting Locations */}
            <Card className="shadow-md">
              <CardHeader className="bg-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  <CardTitle>Meeting Locations</CardTitle>
                </div>
                <CardDescription>
                  Designate meeting places for different scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Near home</h3>
                    <p>Neighbor's driveway or nearby park</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">Outside neighborhood</h3>
                    <p>Church building, school, or a friend's home</p>
                  </div>
                  
                  <div className="pt-2 italic text-gray-600">
                    <p>It's recommended to write or print these locations and keep them with your emergency supplies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checklist & Review */}
            <Card className="shadow-md">
              <CardHeader className="bg-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-6 w-6 text-purple-500" />
                  <CardTitle>Checklist & Review</CardTitle>
                </div>
                <CardDescription>
                  Maintain and practice your emergency plan regularly
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="list-disc pl-5 space-y-3">
                  <li>Review the plan monthly with the family</li>
                  <li>Practice fire, earthquake, and contact drills quarterly</li>
                  <li>Keep a printed copy in each 72-hour kit and car</li>
                  <li>Teach kids how and when to dial 911</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-slate-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Taking Action</h2>
            <p className="mb-4">
              The best emergency plan is one that your family understands and can follow without hesitation.
              Set aside time this week to create your plan, gather necessary supplies, and conduct your first drill.
            </p>
            <p>
              Remember to update your plan whenever there are significant changes to your family situation,
              home environment, or when you learn new information about emergency preparedness.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FamilyEmergencyPlan;
