
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantityCalculator from "@/components/QuantityCalculator";
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Water } from "lucide-react";

const WaterStorage = () => {
  const [peopleCount, setPeopleCount] = useState(1);
  const [days, setDays] = useState(14);
  
  const GALLONS_PER_DAY = 1;

  const handleQuantityChange = (newCount: number) => {
    setPeopleCount(newCount);
  };

  const calculateWaterNeeds = () => {
    return peopleCount * days * GALLONS_PER_DAY;
  };

  const waterMethods = [
    {
      title: "Store-Bought Water",
      description: "Commercial bottled water is convenient and ready to use.",
      pros: ["Convenient", "No preparation needed", "Long shelf life (2+ years unopened)"],
      cons: ["More expensive", "Plastic waste", "Takes up storage space"],
      recommendation: "Great for grab-and-go kits and initial emergency response."
    },
    {
      title: "Water Storage Containers",
      description: "Food-grade containers specifically designed for water storage.",
      pros: ["Cost-effective for larger volumes", "Durable", "Available in various sizes"],
      cons: ["Requires treatment for long-term storage", "Heavy when full", "Needs rotation"],
      recommendation: "Best for home storage; 5-7 gallon containers are manageable for most people."
    },
    {
      title: "Water Barrels",
      description: "Large 55+ gallon drums for substantial water storage.",
      pros: ["Most economical for large volume", "Space efficient", "Stores years of water"],
      cons: ["Difficult to move when full", "Requires pump for access", "Difficult to clean"],
      recommendation: "Ideal for permanent home storage if you have the space."
    }
  ];

  const purificationMethods = [
    {
      title: "Boiling",
      description: "Bring water to a rolling boil for at least 1 minute (3 minutes at elevations above 6,500 feet).",
      effectiveness: "Kills bacteria, viruses, and parasites, but doesn't remove chemicals or sediment."
    },
    {
      title: "Chemical Treatment",
      description: "Water purification tablets or unscented household bleach (6 drops per gallon).",
      effectiveness: "Kills most pathogens but may not be effective against some parasites."
    },
    {
      title: "Filtration",
      description: "Commercial water filters designed for emergency use.",
      effectiveness: "Removes most contaminants, effectiveness varies by filter type and quality."
    },
    {
      title: "Distillation",
      description: "Collecting water vapor from boiling water.",
      effectiveness: "Removes most contaminants including heavy metals and salt."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Water Storage Guide</h1>
            <p className="mt-4 text-lg text-gray-600">
              Clean water is your most essential resource in an emergency. Learn how to store and purify water for your family.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <QuantityCalculator 
                      defaultQuantity={peopleCount} 
                      onChange={handleQuantityChange}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                        Days of Supply
                      </label>
                      <select 
                        id="days"
                        className="block w-full rounded-md border-gray-300 shadow-sm p-2"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                      >
                        <option value="3">3 days (72 hours)</option>
                        <option value="7">7 days (1 week)</option>
                        <option value="14">14 days (2 weeks)</option>
                        <option value="30">30 days (1 month)</option>
                        <option value="90">90 days (3 months)</option>
                        <option value="180">180 days (6 months)</option>
                        <option value="365">365 days (1 year)</option>
                      </select>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Total Water Needed:</span>
                        <span className="text-2xl font-bold text-blue-600">{calculateWaterNeeds()} gallons</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Based on 1 gallon per person per day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
                <h3 className="text-sm font-medium text-sky-800 mb-2">Water Storage Tips</h3>
                <ul className="text-sm text-sky-700 space-y-2 list-disc pl-5">
                  <li>Store water in a cool, dark place away from sunlight</li>
                  <li>Rotate stored water every 6-12 months</li>
                  <li>Don't store water containers directly on concrete</li>
                  <li>Keep a water filter or purification tablets accessible</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
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
                          <Water className="h-5 w-5 text-sky-500 mr-2" />
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WaterStorage;
