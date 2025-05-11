import { useState, useEffect } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KitItem from "@/components/KitItem";
import QuantityCalculator from "@/components/QuantityCalculator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSupply, SupplyItem } from "@/contexts/SupplyContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface KitCategory {
  id: string;
  title: string;
  icon?: string;
  description: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    personMultiplier?: number;
    description?: string;
    isCustom?: boolean;
    infoTooltip?: string;
  }>;
}

// Helper for comparing arrays of SupplyItems
const areSupplyItemsEqual = (arr1: SupplyItem[], arr2: SupplyItem[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const map1 = new Map<string, SupplyItem>();
  arr1.forEach(item => map1.set(item.id, item));
  for (const item2 of arr2) {
    const item1 = map1.get(item2.id);
    if (!item1) return false;
    if (
      item1.currentAmount !== item2.currentAmount ||
      item1.recommendedAmount !== item2.recommendedAmount ||
      item1.name !== item2.name ||
      item1.unit !== item2.unit ||
      item1.category !== item2.category
    ) {
      return false;
    }
  }
  return true;
};

const KitPage = () => {
  const { 
    kitItems: contextKitItems, 
    updateKitItem, 
    initializeKitItems,
    kitPeopleCount,
    setKitPeopleCount
  } = useSupply();
  const [categories, setCategories] = useState<KitCategory[]>([
    {
      id: "water",
      title: "Water",
      description: "Crucial for hydration, cooking, and hygiene. The human body can only survive a few days without water.",
      items: [
        { id: "water-bottle", name: "Water bottle (1 liter)", quantity: 3, personMultiplier: 3, description: "One liter per person per day, minimum", infoTooltip: "Water is essential for survival. In an emergency, clean drinking water may not be available. Bottled water ensures hydration and can be used for basic hygiene. Store in a cool, dark place and rotate every 6-12 months." },
        { id: "water-filter", name: "Portable water filter", quantity: 1, description: "To purify water from natural sources if needed", infoTooltip: "A portable water filter allows you to safely drink from natural sources if bottled water runs out. It removes bacteria and protozoa. Store in your kit and check the filter's lifespan periodically." },
        { id: "water-purification", name: "Water purification tablets", quantity: 1, description: "Backup method to make water safe for drinking", infoTooltip: "Purification tablets are a lightweight backup for making water safe to drink. They kill most pathogens. Store in original packaging and check expiration dates." },
      ]
    },
    {
      id: "food",
      title: "Food",
      description: "High-calorie, non-perishable items that require minimal preparation and provide necessary energy.",
      items: [
        { id: "energy-bars", name: "Energy/Protein bars", quantity: 6, personMultiplier: 6, description: "Compact source of energy and nutrients", infoTooltip: "Energy bars are calorie-dense, require no preparation, and have a long shelf life. They provide quick energy in stressful situations. Store in a cool, dry place and rotate stock as needed." },
        { id: "dried-fruits", name: "Dried fruits and nuts", quantity: 1, personMultiplier: 1, description: "Package per person", infoTooltip: "Dried fruits and nuts are nutritious, lightweight, and non-perishable. They provide essential fats and vitamins. Store in airtight containers to prevent spoilage." },
        { id: "canned-food", name: "Ready-to-eat canned foods", quantity: 3, personMultiplier: 3, description: "With pop-tops for easy opening", infoTooltip: "Canned foods are filling, shelf-stable, and ready to eat. Pop-tops are useful if you don't have a can opener. Store in a cool, dry place and check expiration dates." },
        { id: "utensils", name: "Eating utensils", quantity: 1, personMultiplier: 1, description: "Lightweight, reusable set", infoTooltip: "Reusable utensils allow you to eat safely and hygienically. In an emergency, disposable options may run out. Store a lightweight set in your kit and keep it clean." },
      ]
    },
    {
      id: "first-aid",
      title: "First Aid & Medication",
      description: "Essential for treating injuries and managing health conditions during an emergency.",
      items: [
        { id: "first-aid-kit", name: "Basic First Aid Kit", quantity: 1, description: "Bandages, antiseptic wipes, pain relievers, etc.", infoTooltip: "A first aid kit helps treat minor injuries and prevent infection. In an emergency, medical help may be delayed. Check contents regularly and replace used or expired items." },
        { id: "prescription-meds", name: "Prescription medications", quantity: 1, personMultiplier: 1, description: "3-day supply per person", infoTooltip: "Having a supply of essential prescription medications is critical if pharmacies are closed. Store in original containers and rotate to keep supply fresh." },
        { id: "otc-meds", name: "OTC medications", quantity: 1, description: "Pain relievers, anti-diarrheal, etc.", infoTooltip: "Over-the-counter medications help manage pain, fever, or stomach issues when professional care isn't available. Store in a waterproof bag and check expiration dates." },
        { id: "hand-sanitizer", name: "Hand sanitizer", quantity: 1, description: "For hygiene when water is limited", infoTooltip: "Hand sanitizer helps prevent illness when soap and water aren't available. Store in a leak-proof container and keep away from heat sources." },
      ]
    },
    {
      id: "clothing",
      title: "Clothing & Warmth",
      description: "Protection from the elements is critical to maintain body temperature and prevent illness.",
      items: [
        { id: "change-clothes", name: "Change of clothes", quantity: 1, personMultiplier: 1, description: "Weather-appropriate", infoTooltip: "A change of clothes keeps you dry and comfortable if your clothing gets wet or dirty. Choose weather-appropriate, moisture-wicking fabrics. Store in a sealed bag." },
        { id: "jacket", name: "Rain jacket/poncho", quantity: 1, personMultiplier: 1, infoTooltip: "A rain jacket or poncho protects you from rain and wind, helping prevent hypothermia. Choose a compact, lightweight option and store in an accessible spot." },
        { id: "emergency-blanket", name: "Emergency blanket", quantity: 1, personMultiplier: 1, description: "Reflective mylar blanket for warmth", infoTooltip: "Emergency blankets reflect body heat and are compact. They help prevent hypothermia in cold or wet conditions. Store in original packaging to save space." },
        { id: "sturdy-shoes", name: "Sturdy walking shoes", quantity: 1, personMultiplier: 1, infoTooltip: "Sturdy shoes protect your feet if you need to walk long distances or over debris. Choose comfortable, closed-toe shoes and keep them with your kit." },
      ]
    },
    {
      id: "tools",
      title: "Tools & Supplies",
      description: "Multipurpose items that assist with shelter, signaling, and navigation.",
      items: [
        { id: "flashlight", name: "Flashlight or headlamp", quantity: 1, personMultiplier: 1, description: "With extra batteries", infoTooltip: "A flashlight or headlamp provides light during power outages or at night. Headlamps keep your hands free. Store with extra batteries and test regularly." },
        { id: "multi-tool", name: "Multi-tool or pocket knife", quantity: 1, infoTooltip: "A multi-tool or pocket knife is useful for repairs, food prep, and many tasks. Store in your kit and keep it clean and sharp." },
        { id: "whistle", name: "Emergency whistle", quantity: 1, personMultiplier: 1, description: "For signaling", infoTooltip: "A whistle can signal for help if you're lost or trapped. It's louder and travels farther than shouting. Attach to your bag or wear around your neck." },
        { id: "dust-mask", name: "Dust mask", quantity: 1, personMultiplier: 1, description: "Protection from airborne particles", infoTooltip: "A dust mask protects your lungs from smoke, dust, or debris. Store in a sealed bag to keep clean and dry." },
        { id: "duct-tape", name: "Duct tape", quantity: 1, description: "Small roll, multiple uses", infoTooltip: "Duct tape is versatile for repairs, sealing, or first aid. Wrap a small amount around a pencil to save space in your kit." },
        { id: "paper-pencil", name: "Notepad and pencil", quantity: 1, infoTooltip: "A notepad and pencil let you leave messages, record information, or communicate if phones are down. Store in a waterproof bag." },
        { id: "local-map", name: "Local map", quantity: 1, description: "Paper map of your area", infoTooltip: "A paper map helps you navigate if GPS or phones fail. Mark important locations in advance. Store in a waterproof sleeve." },
      ]
    },
  ]);

  // Initialize kit items if not already in context
  useEffect(() => {
    if (contextKitItems.length === 0) {
      // Convert category items to supply items
      const initialKitItems: SupplyItem[] = categories.flatMap(category => 
        category.items.map(item => ({
          id: item.id,
          name: item.name,
          recommendedAmount: calculateItemQuantity(item.quantity, item.personMultiplier, kitPeopleCount),
          currentAmount: 0,
          unit: "quantity",
          category: category.title,
          type: "kit" as const
        }))
      );
      
      // Only initialize if different
      if (!areSupplyItemsEqual(contextKitItems, initialKitItems)) {
        initializeKitItems(initialKitItems);
      }
    }
  }, [categories, contextKitItems, kitPeopleCount, initializeKitItems]);

  const handleQuantityChange = (newCount: number) => {
    setKitPeopleCount(newCount);
    
    // Update categories with new quantities
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        items: category.items.map(item => ({
          ...item
        }))
      }))
    );
    
    // Update kit items in context with new recommended amounts
    if (contextKitItems.length > 0) {
      contextKitItems.forEach(item => {
        const category = categories.find(cat => cat.title === item.category);
        if (category) {
          const categoryItem = category.items.find(i => i.id === item.id);
          if (categoryItem) {
            const newRecommendedAmount = calculateItemQuantity(categoryItem.quantity, categoryItem.personMultiplier, newCount);
            updateKitItem(item.id, item.currentAmount, newRecommendedAmount);
          }
        }
      });
    }
  };

  const handleRemoveItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  const calculateItemQuantity = (baseQuantity: number, multiplier: number | undefined, count = kitPeopleCount) => {
    if (multiplier) {
      return baseQuantity * count;
    }
    return baseQuantity;
  };

  // Calculate overall kit progress
  const calculateKitProgress = () => {
    if (contextKitItems.length === 0) return 0;
    
    const totalRecommended = contextKitItems.reduce((sum, item) => sum + item.recommendedAmount, 0);
    const totalCurrent = contextKitItems.reduce((sum, item) => sum + Math.min(item.currentAmount, item.recommendedAmount), 0);
    
    return Math.floor((totalCurrent / totalRecommended) * 100);
  };

  const handleUpdateItem = (id: string, currentAmount: number) => {
    updateKitItem(id, currentAmount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">72-Hour Emergency Kit</h1>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to survive the first critical 72 hours of an emergency situation.
              Customize the list for your family's specific needs.
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
                defaultQuantity={kitPeopleCount} 
                onChange={handleQuantityChange}
                value={kitPeopleCount}
              />

              <Card className="border-gray-100">
                <CardContent className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">Kit Completion</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Items Ready</span>
                      <span className="text-lg font-bold text-gray-900">{calculateKitProgress()}%</span>
                    </div>
                    <Progress 
                      value={calculateKitProgress()} 
                      className={`h-2 ${
                        calculateKitProgress() >= 100 ? "bg-green-500" :
                        calculateKitProgress() >= 50 ? "bg-sky-500" : 
                        calculateKitProgress() > 0 ? "bg-amber-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Why a 72-Hour Kit?</h3>
                <p className="text-sm text-blue-700">
                  In most emergencies, it can take up to three days for relief services to reach you. 
                  Having supplies ready for this critical period ensures your family's safety and comfort.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {categories.map((category) => (
                  <AccordionItem 
                    value={category.id} 
                    key={category.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center text-left">
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="px-6 py-2 bg-gray-50 text-gray-600 text-sm mb-4">
                        {category.description}
                      </div>
                      <div className="px-6 space-y-3">
                        {category.items.map((item) => {
                          const calculatedQuantity = calculateItemQuantity(item.quantity, item.personMultiplier);
                          const kitItem = contextKitItems.find(i => i.id === item.id);
                          const currentAmount = kitItem ? kitItem.currentAmount : 0;
                          
                          return (
                            <div key={item.id} className="border border-gray-200 rounded-md p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900 flex items-center">
                                    {item.name}
                                    <InfoTooltip label={item.infoTooltip || `More info coming`} />
                                  </h4>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-medium">Need: {calculatedQuantity}</span>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500 mr-2">Have:</span>
                                  <input
                                    type="number"
                                    className="w-16 h-8 border border-gray-300 rounded text-center"
                                    value={currentAmount}
                                    min="0"
                                    onChange={(e) => handleUpdateItem(item.id, parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                
                                <div className="ml-4 flex items-center">
                                  <span className="text-xs mr-2">
                                    {Math.min(Math.round((currentAmount / calculatedQuantity) * 100), 100)}%
                                  </span>
                                  <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        currentAmount >= calculatedQuantity ? "bg-green-500" :
                                        currentAmount > 0 ? "bg-amber-500" : "bg-gray-300"
                                      }`}
                                      style={{ width: `${Math.min(Math.round((currentAmount / calculatedQuantity) * 100), 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add custom item
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KitPage;
