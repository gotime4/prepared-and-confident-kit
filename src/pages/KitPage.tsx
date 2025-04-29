
import { useState } from 'react';
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
  }>;
}

const KitPage = () => {
  const [peopleCount, setPeopleCount] = useState(1);
  const [categories, setCategories] = useState<KitCategory[]>([
    {
      id: "water",
      title: "Water",
      description: "Crucial for hydration, cooking, and hygiene. The human body can only survive a few days without water.",
      items: [
        { id: "water-bottle", name: "Water bottle (1 liter)", quantity: 3, personMultiplier: 3, description: "One liter per person per day, minimum" },
        { id: "water-filter", name: "Portable water filter", quantity: 1, description: "To purify water from natural sources if needed" },
        { id: "water-purification", name: "Water purification tablets", quantity: 1, description: "Backup method to make water safe for drinking" },
      ]
    },
    {
      id: "food",
      title: "Food",
      description: "High-calorie, non-perishable items that require minimal preparation and provide necessary energy.",
      items: [
        { id: "energy-bars", name: "Energy/Protein bars", quantity: 6, personMultiplier: 6, description: "Compact source of energy and nutrients" },
        { id: "dried-fruits", name: "Dried fruits and nuts", quantity: 1, personMultiplier: 1, description: "Package per person" },
        { id: "canned-food", name: "Ready-to-eat canned foods", quantity: 3, personMultiplier: 3, description: "With pop-tops for easy opening" },
        { id: "utensils", name: "Eating utensils", quantity: 1, personMultiplier: 1, description: "Lightweight, reusable set" },
      ]
    },
    {
      id: "first-aid",
      title: "First Aid & Medication",
      description: "Essential for treating injuries and managing health conditions during an emergency.",
      items: [
        { id: "first-aid-kit", name: "Basic First Aid Kit", quantity: 1, description: "Bandages, antiseptic wipes, pain relievers, etc." },
        { id: "prescription-meds", name: "Prescription medications", quantity: 1, personMultiplier: 1, description: "3-day supply per person" },
        { id: "otc-meds", name: "OTC medications", quantity: 1, description: "Pain relievers, anti-diarrheal, etc." },
        { id: "hand-sanitizer", name: "Hand sanitizer", quantity: 1, description: "For hygiene when water is limited" },
      ]
    },
    {
      id: "clothing",
      title: "Clothing & Warmth",
      description: "Protection from the elements is critical to maintain body temperature and prevent illness.",
      items: [
        { id: "change-clothes", name: "Change of clothes", quantity: 1, personMultiplier: 1, description: "Weather-appropriate" },
        { id: "jacket", name: "Rain jacket/poncho", quantity: 1, personMultiplier: 1 },
        { id: "emergency-blanket", name: "Emergency blanket", quantity: 1, personMultiplier: 1, description: "Reflective mylar blanket for warmth" },
        { id: "sturdy-shoes", name: "Sturdy walking shoes", quantity: 1, personMultiplier: 1 },
      ]
    },
    {
      id: "tools",
      title: "Tools & Supplies",
      description: "Multipurpose items that assist with shelter, signaling, and navigation.",
      items: [
        { id: "flashlight", name: "Flashlight or headlamp", quantity: 1, personMultiplier: 1, description: "With extra batteries" },
        { id: "multi-tool", name: "Multi-tool or pocket knife", quantity: 1 },
        { id: "whistle", name: "Emergency whistle", quantity: 1, personMultiplier: 1, description: "For signaling" },
        { id: "dust-mask", name: "Dust mask", quantity: 1, personMultiplier: 1, description: "Protection from airborne particles" },
        { id: "duct-tape", name: "Duct tape", quantity: 1, description: "Small roll, multiple uses" },
        { id: "paper-pencil", name: "Notepad and pencil", quantity: 1 },
        { id: "local-map", name: "Local map", quantity: 1, description: "Paper map of your area" },
      ]
    },
  ]);

  const handleQuantityChange = (newCount: number) => {
    setPeopleCount(newCount);
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

  const calculateItemQuantity = (baseQuantity: number, multiplier: number | undefined) => {
    if (multiplier) {
      return baseQuantity * peopleCount;
    }
    return baseQuantity;
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
                defaultQuantity={peopleCount} 
                onChange={handleQuantityChange}
              />

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
                        {category.items.map((item) => (
                          <KitItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            quantity={calculateItemQuantity(item.quantity, item.personMultiplier)}
                            category={category.id}
                            description={item.description}
                            isRemovable={item.isCustom}
                            onRemove={item.isCustom ? () => handleRemoveItem(category.id, item.id) : undefined}
                          />
                        ))}
                        
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
