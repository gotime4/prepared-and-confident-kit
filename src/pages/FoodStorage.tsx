
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantityCalculator from "@/components/QuantityCalculator";
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FoodStorage = () => {
  const [peopleCount, setPeopleCount] = useState(1);

  const handleQuantityChange = (newCount: number) => {
    setPeopleCount(newCount);
  };

  const calculateQuantity = (baseAmount: number) => {
    return (baseAmount * peopleCount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Long-Term Food Storage</h1>
            <p className="mt-4 text-lg text-gray-600">
              A comprehensive guide to building and maintaining your long-term food storage,
              ensuring your family has nutritious options in any situation.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <QuantityCalculator 
                defaultQuantity={peopleCount} 
                onChange={handleQuantityChange}
              />

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h3 className="text-sm font-medium text-amber-800 mb-2">Why Store Food?</h3>
                <p className="text-sm text-amber-700">
                  Long-term food storage provides security during natural disasters, economic hardship, or supply chain disruptions. 
                  A well-planned food storage system ensures your family's nutritional needs are met.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Food Storage Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Below is a recommended one-year supply for {peopleCount} {peopleCount === 1 ? 'person' : 'people'}.
                  Adjust quantities based on your family's preferences and dietary needs.
                </p>

                <Tabs defaultValue="staples" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="staples">Staples</TabsTrigger>
                    <TabsTrigger value="canned">Canned Goods</TabsTrigger>
                    <TabsTrigger value="dried">Dried Foods</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="staples">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Grains</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Wheat</span>
                              <span className="font-medium">{calculateQuantity(60)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>White Rice</span>
                              <span className="font-medium">{calculateQuantity(40)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Rolled Oats</span>
                              <span className="font-medium">{calculateQuantity(20)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pasta</span>
                              <span className="font-medium">{calculateQuantity(15)} lbs</span>
                            </li>
                          </ul>
                          <div className="mt-3 text-xs text-gray-500">
                            Total: {calculateQuantity(135)} lbs
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Legumes</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Black Beans</span>
                              <span className="font-medium">{calculateQuantity(10)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pinto Beans</span>
                              <span className="font-medium">{calculateQuantity(10)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Lentils</span>
                              <span className="font-medium">{calculateQuantity(8)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Split Peas</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                          </ul>
                          <div className="mt-3 text-xs text-gray-500">
                            Total: {calculateQuantity(33)} lbs
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Fats & Oils</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Vegetable Oil</span>
                              <span className="font-medium">{calculateQuantity(3)} gallons</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Shortening</span>
                              <span className="font-medium">{calculateQuantity(3)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Peanut Butter</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Sugars</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>White Sugar</span>
                              <span className="font-medium">{calculateQuantity(20)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Brown Sugar</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Honey</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="canned">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Canned Proteins</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Tuna</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Chicken</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Salmon</span>
                              <span className="font-medium">{calculateQuantity(6)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Beef</span>
                              <span className="font-medium">{calculateQuantity(6)} cans</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Canned Fruits</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Peaches</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pears</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pineapple</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Applesauce</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-2">Canned Vegetables</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Green Beans</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Corn</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Carrots</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                          </ul>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Tomatoes</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Peas</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Mixed Vegetables</span>
                              <span className="font-medium">{calculateQuantity(12)} cans</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dried">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Dried Fruits</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Raisins</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Apricots</span>
                              <span className="font-medium">{calculateQuantity(3)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Apple Slices</span>
                              <span className="font-medium">{calculateQuantity(3)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Banana Chips</span>
                              <span className="font-medium">{calculateQuantity(2)} lbs</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-medium mb-2">Nuts & Seeds</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Almonds</span>
                              <span className="font-medium">{calculateQuantity(3)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Walnuts</span>
                              <span className="font-medium">{calculateQuantity(2)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Sunflower Seeds</span>
                              <span className="font-medium">{calculateQuantity(2)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pumpkin Seeds</span>
                              <span className="font-medium">{calculateQuantity(1)} lb</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-2">Freeze-Dried</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Vegetables</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Fruits</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                          </ul>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                              <span>Meats</span>
                              <span className="font-medium">{calculateQuantity(5)} lbs</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Complete Meals</span>
                              <span className="font-medium">{calculateQuantity(10)} servings</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Food Storage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-400 pl-4 py-1">
                    <h3 className="font-medium text-gray-900">Store What You Eat, Eat What You Store</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Focus on foods your family regularly consumes to ensure rotation and familiarity.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-4 py-1">
                    <h3 className="font-medium text-gray-900">Proper Storage Containers</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Use food-grade containers with airtight seals. Consider oxygen absorbers for long-term storage.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-4 py-1">
                    <h3 className="font-medium text-gray-900">Cool, Dark, and Dry</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Maintain a storage area that's consistently cool (below 70°F if possible), dark, and has low humidity.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-4 py-1">
                    <h3 className="font-medium text-gray-900">Rotation System</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Implement a "First In, First Out" (FIFO) rotation system to ensure food is used before expiration.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-4 py-1">
                    <h3 className="font-medium text-gray-900">Diversify Your Storage</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Include a variety of foods to provide balanced nutrition and prevent menu fatigue.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FoodStorage;
