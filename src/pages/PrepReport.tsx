import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSupply } from "@/contexts/SupplyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, BarChart2, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generatePDF } from "@/utils/reportGenerator";

const PrepReport = () => {
  const { 
    foodItems, 
    kitItems, 
    calculateProgress, 
    getPriorities, 
    getOverallScore, 
    getCompletedCount 
  } = useSupply();
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const foodProgress = calculateProgress(foodItems);
  const kitProgress = calculateProgress(kitItems);
  const overallScore = getOverallScore();
  const priorityItems = getPriorities();
  const completionCounts = getCompletedCount();
  
  // Combine all items for the detailed inventory in the PDF
  const allItems = [...foodItems, ...kitItems];
  
  const handleDownloadReport = () => {
    setIsGenerating(true);
    
    // Small delay to allow UI to update with "Generating..." state
    setTimeout(() => {
      try {
        generatePDF({
          foodProgress,
          kitProgress,
          overallScore,
          priorityItems,
          completedCounts: completionCounts,
          allItems // Pass all items to the report generator
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Preparedness Report</h1>
          
          {/* Overall Score Card */}
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Overall Preparedness Score</CardTitle>
              <CardDescription>Your family's current level of preparedness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center border-8 border-primary relative">
                  <span className="text-4xl font-bold">{overallScore}%</span>
                </div>
              </div>
              <Progress value={overallScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          {/* Category Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Category Progress</CardTitle>
              <CardDescription>Breakdown of preparedness by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">72-Hour Emergency Kit</span>
                    <span className="text-sm font-medium">{kitProgress}%</span>
                  </div>
                  <Progress value={kitProgress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Food Storage</span>
                    <span className="text-sm font-medium">{foodProgress}%</span>
                  </div>
                  <Progress value={foodProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Priority Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Priority Items</CardTitle>
              <CardDescription>Focus on these items to improve your score</CardDescription>
            </CardHeader>
            <CardContent>
              {priorityItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priorityItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.currentAmount} {item.unit}</TableCell>
                        <TableCell>{item.recommendedAmount} {item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No priority items found. Great job!
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Completion Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Completion Status</CardTitle>
              <CardDescription>Overview of your preparedness items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{completionCounts.complete}</p>
                  <p className="text-sm text-green-800">Complete</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">{completionCounts.inProgress}</p>
                  <p className="text-sm text-amber-800">In Progress</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{completionCounts.notStarted}</p>
                  <p className="text-sm text-gray-800">Not Started</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Generate Report Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleDownloadReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Download PDF Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrepReport;
