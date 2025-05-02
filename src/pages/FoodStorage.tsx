import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuantityCalculator from "@/components/QuantityCalculator";
import { useSupply, SupplyItem } from "@/contexts/SupplyContext";
import SupplyItemComponent from "@/components/SupplyItem";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Base amounts for 1 person (per year)
const BASE_AMOUNTS = {
  // Grains
  "wheat": 60,
  "rice": 40,
  "oats": 20,
  "pasta": 15,
  
  // Legumes
  "black-beans": 10,
  "pinto-beans": 10,
  "lentils": 8,
  "split-peas": 5,
  
  // Fats & Oils
  "vegetable-oil": 3,
  "shortening": 3,
  "peanut-butter": 5,
  
  // Sugars
  "white-sugar": 20,
  "brown-sugar": 5,
  "honey": 5,
  
  // Canned Proteins
  "tuna": 12,
  "chicken": 12,
  "salmon": 6,
  "beef": 6,
  
  // Canned Fruits
  "peaches": 12,
  "pears": 12,
  "pineapple": 12,
  "applesauce": 12,
  
  // Canned Vegetables
  "green-beans": 12,
  "corn": 12,
  "carrots": 12,
  "tomatoes": 12,
  "peas": 12,
  "mixed-vegetables": 12,
  
  // Dried Items
  "raisins": 5,
  "apricots": 3,
  "apple-slices": 3,
  "banana-chips": 2
};

const FoodStorage = () => {
  // Initialize peopleCount from localStorage or default to 1
  const [peopleCount, setPeopleCount] = useState(() => {
    const savedPeopleCount = localStorage.getItem('foodPeopleCount');
    return savedPeopleCount ? parseInt(savedPeopleCount) : 1;
  });

  const { 
    foodItems: contextFoodItems, 
    updateFoodItem, 
    initializeFoodItems,
    updateFoodItemsRecommendedAmounts
  } = useSupply();
  const [foodItems, setFoodItems] = useState<SupplyItem[]>([]);
  
  // Calculate the recommended amount for an item based on the number of people
  const calculateRecommendedAmount = (itemId: string, people: number) => {
    return (BASE_AMOUNTS[itemId as keyof typeof BASE_AMOUNTS] || 0) * people;
  };

  // Use a callback to ensure consistent behavior when updating recommended amounts
  const updateRecommendedAmounts = useCallback((items: SupplyItem[], people: number) => {
    const updatedItems = items.map(item => ({
      ...item,
      recommendedAmount: calculateRecommendedAmount(item.id, people)
    }));
    
    // Update the component's state
    setFoodItems(updatedItems);
    
    // Update the context to ensure cloud sync
    updateFoodItemsRecommendedAmounts(updatedItems);
    
    return updatedItems;
  }, [updateFoodItemsRecommendedAmounts]);

  // Effect to initialize or update items when contextFoodItems or peopleCount changes
  useEffect(() => {
    // If we don't have any items from context yet, initialize them
    if (contextFoodItems.length === 0) {
      const initialItems: SupplyItem[] = [
        // Grains
        { id: "wheat", name: "Wheat", recommendedAmount: calculateRecommendedAmount("wheat", peopleCount), currentAmount: 0, unit: "lbs", category: "Grains", type: "food" },
        { id: "rice", name: "White Rice", recommendedAmount: calculateRecommendedAmount("rice", peopleCount), currentAmount: 0, unit: "lbs", category: "Grains", type: "food" },
        { id: "oats", name: "Rolled Oats", recommendedAmount: calculateRecommendedAmount("oats", peopleCount), currentAmount: 0, unit: "lbs", category: "Grains", type: "food" },
        { id: "pasta", name: "Pasta", recommendedAmount: calculateRecommendedAmount("pasta", peopleCount), currentAmount: 0, unit: "lbs", category: "Grains", type: "food" },
        
        // Legumes
        { id: "black-beans", name: "Black Beans", recommendedAmount: calculateRecommendedAmount("black-beans", peopleCount), currentAmount: 0, unit: "lbs", category: "Legumes", type: "food" },
        { id: "pinto-beans", name: "Pinto Beans", recommendedAmount: calculateRecommendedAmount("pinto-beans", peopleCount), currentAmount: 0, unit: "lbs", category: "Legumes", type: "food" },
        { id: "lentils", name: "Lentils", recommendedAmount: calculateRecommendedAmount("lentils", peopleCount), currentAmount: 0, unit: "lbs", category: "Legumes", type: "food" },
        { id: "split-peas", name: "Split Peas", recommendedAmount: calculateRecommendedAmount("split-peas", peopleCount), currentAmount: 0, unit: "lbs", category: "Legumes", type: "food" },
        
        // Fats & Oils
        { id: "vegetable-oil", name: "Vegetable Oil", recommendedAmount: calculateRecommendedAmount("vegetable-oil", peopleCount), currentAmount: 0, unit: "gallons", category: "Fats & Oils", type: "food" },
        { id: "shortening", name: "Shortening", recommendedAmount: calculateRecommendedAmount("shortening", peopleCount), currentAmount: 0, unit: "lbs", category: "Fats & Oils", type: "food" },
        { id: "peanut-butter", name: "Peanut Butter", recommendedAmount: calculateRecommendedAmount("peanut-butter", peopleCount), currentAmount: 0, unit: "lbs", category: "Fats & Oils", type: "food" },
        
        // Sugars
        { id: "white-sugar", name: "White Sugar", recommendedAmount: calculateRecommendedAmount("white-sugar", peopleCount), currentAmount: 0, unit: "lbs", category: "Sugars", type: "food" },
        { id: "brown-sugar", name: "Brown Sugar", recommendedAmount: calculateRecommendedAmount("brown-sugar", peopleCount), currentAmount: 0, unit: "lbs", category: "Sugars", type: "food" },
        { id: "honey", name: "Honey", recommendedAmount: calculateRecommendedAmount("honey", peopleCount), currentAmount: 0, unit: "lbs", category: "Sugars", type: "food" },
        
        // Canned Proteins
        { id: "tuna", name: "Tuna", recommendedAmount: calculateRecommendedAmount("tuna", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Proteins", type: "food" },
        { id: "chicken", name: "Chicken", recommendedAmount: calculateRecommendedAmount("chicken", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Proteins", type: "food" },
        { id: "salmon", name: "Salmon", recommendedAmount: calculateRecommendedAmount("salmon", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Proteins", type: "food" },
        { id: "beef", name: "Beef", recommendedAmount: calculateRecommendedAmount("beef", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Proteins", type: "food" },
        
        // Canned Fruits
        { id: "peaches", name: "Peaches", recommendedAmount: calculateRecommendedAmount("peaches", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Fruits", type: "food" },
        { id: "pears", name: "Pears", recommendedAmount: calculateRecommendedAmount("pears", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Fruits", type: "food" },
        { id: "pineapple", name: "Pineapple", recommendedAmount: calculateRecommendedAmount("pineapple", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Fruits", type: "food" },
        { id: "applesauce", name: "Applesauce", recommendedAmount: calculateRecommendedAmount("applesauce", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Fruits", type: "food" },
        
        // Canned Vegetables
        { id: "green-beans", name: "Green Beans", recommendedAmount: calculateRecommendedAmount("green-beans", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        { id: "corn", name: "Corn", recommendedAmount: calculateRecommendedAmount("corn", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        { id: "carrots", name: "Carrots", recommendedAmount: calculateRecommendedAmount("carrots", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        { id: "tomatoes", name: "Tomatoes", recommendedAmount: calculateRecommendedAmount("tomatoes", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        { id: "peas", name: "Peas", recommendedAmount: calculateRecommendedAmount("peas", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        { id: "mixed-vegetables", name: "Mixed Vegetables", recommendedAmount: calculateRecommendedAmount("mixed-vegetables", peopleCount), currentAmount: 0, unit: "cans", category: "Canned Vegetables", type: "food" },
        
        // Dried Items
        { id: "raisins", name: "Raisins", recommendedAmount: calculateRecommendedAmount("raisins", peopleCount), currentAmount: 0, unit: "lbs", category: "Dried Fruits", type: "food" },
        { id: "apricots", name: "Apricots", recommendedAmount: calculateRecommendedAmount("apricots", peopleCount), currentAmount: 0, unit: "lbs", category: "Dried Fruits", type: "food" },
        { id: "apple-slices", name: "Apple Slices", recommendedAmount: calculateRecommendedAmount("apple-slices", peopleCount), currentAmount: 0, unit: "lbs", category: "Dried Fruits", type: "food" },
        { id: "banana-chips", name: "Banana Chips", recommendedAmount: calculateRecommendedAmount("banana-chips", peopleCount), currentAmount: 0, unit: "lbs", category: "Dried Fruits", type: "food" },
      ];
      
      // Initialize the food items in the context
      initializeFoodItems(initialItems);
      setFoodItems(initialItems);
    } else {
      // Update with the current people count
      updateRecommendedAmounts(contextFoodItems, peopleCount);
    }
  }, [peopleCount, contextFoodItems, initializeFoodItems, updateRecommendedAmounts]);

  const handleQuantityChange = (newCount: number) => {
    // Save the people count to localStorage
    localStorage.setItem('foodPeopleCount', newCount.toString());
    
    // Update the people count - this will trigger the useEffect above
    setPeopleCount(newCount);

    toast({
      title: "People Count Updated",
      description: `Recommendations now calculated for ${newCount} people.`,
    });
  };

  const handleUpdateCurrentAmount = (id: string, amount: number) => {
    // Update local state
    setFoodItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, currentAmount: amount } : item
      )
    );
    
    // Update the supply context (which will trigger database sync)
    updateFoodItem(id, amount);
  };

  // Group items by category
  const staples = foodItems.filter(item => 
    ["Grains", "Legumes", "Fats & Oils", "Sugars"].includes(item.category)
  );
  
  const canned = foodItems.filter(item => 
    ["Canned Proteins", "Canned Fruits", "Canned Vegetables"].includes(item.category)
  );
  
  const dried = foodItems.filter(item => 
    ["Dried Fruits", "Nuts & Seeds", "Freeze-Dried"].includes(item.category)
  );

  // Calculate overall progress
  const calculateProgress = (items: SupplyItem[]) => {
    if (items.length === 0) return 0;
    
    const totalRecommended = items.reduce((sum, item) => sum + item.recommendedAmount, 0);
    const totalCurrent = items.reduce((sum, item) => sum + Math.min(item.currentAmount, item.recommendedAmount), 0);
    
    return Math.floor((totalCurrent / totalRecommended) * 100);
  };

  const overallProgress = calculateProgress(foodItems);

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
                value={peopleCount}
                onChange={handleQuantityChange}
              />

              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Overall Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Storage Complete</span>
                      <span className="text-lg font-bold text-gray-900">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

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
                <CardTitle>Food Storage Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track your progress by entering the amounts you currently have. The recommendations below are for {peopleCount} {peopleCount === 1 ? 'person' : 'people'} for one year.
                </p>

                <Tabs defaultValue="staples" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="staples">Staples</TabsTrigger>
                    <TabsTrigger value="canned">Canned Goods</TabsTrigger>
                    <TabsTrigger value="dried">Dried Foods</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="staples">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 mb-2">Grains</h3>
                      {staples.filter(item => item.category === "Grains").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}

                      <h3 className="font-medium text-gray-900 mt-6 mb-2">Legumes</h3>
                      {staples.filter(item => item.category === "Legumes").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}

                      <h3 className="font-medium text-gray-900 mt-6 mb-2">Fats & Oils</h3>
                      {staples.filter(item => item.category === "Fats & Oils").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}

                      <h3 className="font-medium text-gray-900 mt-6 mb-2">Sugars</h3>
                      {staples.filter(item => item.category === "Sugars").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="canned">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 mb-2">Canned Proteins</h3>
                      {canned.filter(item => item.category === "Canned Proteins").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}

                      <h3 className="font-medium text-gray-900 mt-6 mb-2">Canned Fruits</h3>
                      {canned.filter(item => item.category === "Canned Fruits").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}

                      <h3 className="font-medium text-gray-900 mt-6 mb-2">Canned Vegetables</h3>
                      {canned.filter(item => item.category === "Canned Vegetables").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dried">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 mb-2">Dried Fruits</h3>
                      {dried.filter(item => item.category === "Dried Fruits").map(item => (
                        <SupplyItemComponent 
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          recommendedAmount={item.recommendedAmount}
                          unit={item.unit}
                          category={item.category}
                          onUpdateCurrentAmount={handleUpdateCurrentAmount}
                          currentAmount={item.currentAmount}
                        />
                      ))}
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
