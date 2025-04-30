
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSupply, SupplyItem } from "@/contexts/SupplyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, ArrowDown } from "lucide-react";
import { generatePDF } from "@/utils/reportGenerator";
import { toast } from "@/components/ui/use-toast";

const PrepReport = () => {
  const { 
    foodItems, 
    kitItems, 
    calculateProgress, 
    getPriorities, 
    getCompletedCount, 
    getOverallScore 
  } = useSupply();
  
  const [priorities, setPriorities] = useState<SupplyItem[]>([]);
  const [statusCounts, setStatusCounts] = useState({ complete: 0, inProgress: 0, notStarted: 0 });
  const [overallScore, setOverallScore] = useState(0);
  const [foodProgress, setFoodProgress] = useState(0);
  const [kitProgress, setKitProgress] = useState(0);

  useEffect(() => {
    setPriorities(getPriorities());
    setStatusCounts(getCompletedCount());
    setOverallScore(getOverallScore());
    setFoodProgress(calculateProgress(foodItems));
    setKitProgress(calculateProgress(kitItems));
  }, [foodItems, kitItems, calculateProgress, getPriorities, getCompletedCount, getOverallScore]);

  const handleDownloadPDF = () => {
    try {
      const doc = generatePDF(
        foodItems,
        kitItems,
        overallScore,
        statusCounts,
        priorities
      );
      
      doc.save("Family_Readiness_Report.pdf");
      
      toast({
        title: "Report Downloaded",
        description: "Your Family Readiness Report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
      console.error("PDF generation error:", error);
    }
  };

  // Helper function to get status color
  const getStatusColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-sky-500";
    if (progress > 0) return "bg-amber-500";
    return "bg-gray-300";
  };

  // Helper function to get status text
  const getStatusText = (progress: number): string => {
    if (progress >= 100) return "Complete";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Family Readiness Report</h1>
            <p className="mt-4 text-lg text-gray-600">
              A personalized snapshot of your emergency and long-term preparedness
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
            <CardDescription>
              Your household's current preparedness status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">{overallScore}%</div>
                  <div className="text-sm text-gray-500 mt-1">Complete</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-xl font-bold text-green-600">{statusCounts.complete}</span>
                  <span className="text-sm text-gray-600">Complete</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-sky-50 rounded-lg">
                  <span className="text-xl font-bold text-sky-600">{statusCounts.inProgress}</span>
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-xl font-bold text-gray-600">{statusCounts.notStarted}</span>
                  <span className="text-sm text-gray-600">Not Started</span>
                </div>
              </div>

              <Button 
                onClick={handleDownloadPDF} 
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Food Storage */}
          <Card>
            <CardHeader>
              <CardTitle>Long-Term Food Storage</CardTitle>
              <CardDescription>
                {foodItems.length} items tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className={`text-sm font-medium ${
                      foodProgress >= 100 ? 'text-green-500' : 
                      foodProgress >= 50 ? 'text-sky-600' : 
                      foodProgress > 0 ? 'text-amber-500' : 'text-gray-500'
                    }`}>{foodProgress}%</span>
                  </div>
                  <Progress value={foodProgress} className={`h-2 ${getStatusColor(foodProgress)}`} />
                  <div className="mt-1 text-xs text-right text-gray-500">
                    {getStatusText(foodProgress)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                  {Object.entries(
                    foodItems.reduce((acc: {[key: string]: {total: number, current: number}}, item) => {
                      if (!acc[item.category]) {
                        acc[item.category] = {total: 0, current: 0};
                      }
                      acc[item.category].total += item.recommendedAmount;
                      acc[item.category].current += Math.min(item.currentAmount, item.recommendedAmount);
                      return acc;
                    }, {})
                  ).sort((a, b) => 
                    (b[1].current/b[1].total) - (a[1].current/a[1].total)
                  ).slice(0, 3).map(([category, data]) => {
                    const catProgress = Math.floor((data.current / data.total) * 100);
                    return (
                      <div key={category} className="mb-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>{category}</span>
                          <span>{catProgress}%</span>
                        </div>
                        <Progress value={catProgress} className={`h-1.5 ${getStatusColor(catProgress)}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 72-Hour Kit */}
          <Card>
            <CardHeader>
              <CardTitle>72-Hour Emergency Kit</CardTitle>
              <CardDescription>
                {kitItems.length} items tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className={`text-sm font-medium ${
                      kitProgress >= 100 ? 'text-green-500' : 
                      kitProgress >= 50 ? 'text-sky-600' : 
                      kitProgress > 0 ? 'text-amber-500' : 'text-gray-500'
                    }`}>{kitProgress}%</span>
                  </div>
                  <Progress value={kitProgress} className={`h-2 ${getStatusColor(kitProgress)}`} />
                  <div className="mt-1 text-xs text-right text-gray-500">
                    {getStatusText(kitProgress)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                  {Object.entries(
                    kitItems.reduce((acc: {[key: string]: {total: number, current: number}}, item) => {
                      if (!acc[item.category]) {
                        acc[item.category] = {total: 0, current: 0};
                      }
                      acc[item.category].total += item.recommendedAmount;
                      acc[item.category].current += Math.min(item.currentAmount, item.recommendedAmount);
                      return acc;
                    }, {})
                  ).sort((a, b) => 
                    (b[1].current/b[1].total) - (a[1].current/a[1].total)
                  ).slice(0, 3).map(([category, data]) => {
                    const catProgress = Math.floor((data.current / data.total) * 100);
                    return (
                      <div key={category} className="mb-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>{category}</span>
                          <span>{catProgress}%</span>
                        </div>
                        <Progress value={catProgress} className={`h-1.5 ${getStatusColor(catProgress)}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priorities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Priorities</CardTitle>
            <CardDescription>
              Focus on these items to improve your preparedness level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorities.length > 0 ? priorities.map((item, index) => {
                const progress = Math.floor((item.currentAmount / item.recommendedAmount) * 100);
                return (
                  <div key={item.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500">
                            {item.category} • {item.type === 'food' ? 'Long-Term Storage' : '72-Hour Kit'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 md:w-48">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{item.currentAmount} of {item.recommendedAmount} {item.unit}</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className={`h-1.5 ${getStatusColor(progress)}`} />
                    </div>
                    {progress < 100 && (
                      <div className="ml-4">
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          progress === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {progress === 0 ? 'Not Started' : 'Add More'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-gray-500">
                  No priority items found. You're in great shape!
                </div>
              )}
              
              {priorities.length > 0 && (
                <div className="flex justify-center mt-6">
                  <ArrowDown className="w-5 h-5 text-gray-400 animate-bounce" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PrepReport;
