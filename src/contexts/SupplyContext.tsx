import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for our supply items
export interface SupplyItem {
  id: string;
  name: string;
  recommendedAmount: number;
  currentAmount: number;
  unit: string;
  category: string;
  type: 'food' | 'kit';
}

// Context interface
interface SupplyContextType {
  foodItems: SupplyItem[];
  kitItems: SupplyItem[];
  updateFoodItem: (id: string, amount: number) => void;
  updateKitItem: (id: string, amount: number, recommendedAmount?: number) => void;
  initializeFoodItems: (items: SupplyItem[]) => void;
  initializeKitItems: (items: SupplyItem[]) => void;
  updateFoodItemsRecommendedAmounts: (items: SupplyItem[]) => void;
  calculateProgress: (items: SupplyItem[]) => number;
  getPriorities: () => SupplyItem[];
  getCompletedCount: () => { complete: number, inProgress: number, notStarted: number };
  getOverallScore: () => number;
}

const SupplyContext = createContext<SupplyContextType | undefined>(undefined);

export const useSupply = () => {
  const context = useContext(SupplyContext);
  if (context === undefined) {
    throw new Error('useSupply must be used within a SupplyProvider');
  }
  return context;
};

interface SupplyProviderProps {
  children: ReactNode;
}

export const SupplyProvider: React.FC<SupplyProviderProps> = ({ children }) => {
  // Initialize with empty arrays
  const [foodItems, setFoodItems] = useState<SupplyItem[]>([]);
  const [kitItems, setKitItems] = useState<SupplyItem[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFoodItems = localStorage.getItem('foodItems');
    const savedKitItems = localStorage.getItem('kitItems');
    
    if (savedFoodItems) {
      setFoodItems(JSON.parse(savedFoodItems));
    }
    
    if (savedKitItems) {
      setKitItems(JSON.parse(savedKitItems));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (foodItems.length > 0) {
      localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }
  }, [foodItems]);
  
  useEffect(() => {
    if (kitItems.length > 0) {
      localStorage.setItem('kitItems', JSON.stringify(kitItems));
    }
  }, [kitItems]);

  // Initialize food items (for first time setup)
  const initializeFoodItems = (items: SupplyItem[]) => {
    // Only initialize if we don't already have items
    if (foodItems.length === 0) {
      setFoodItems(items);
    }
  };

  // Initialize kit items (for first time setup)
  const initializeKitItems = (items: SupplyItem[]) => {
    // Only initialize if we don't already have items
    if (kitItems.length === 0) {
      setKitItems(items);
    }
  };

  // Update a food item's current amount
  const updateFoodItem = (id: string, amount: number) => {
    setFoodItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, currentAmount: amount } : item
      )
    );
  };

  // Update a kit item's current amount
  const updateKitItem = (id: string, amount: number, recommendedAmount?: number) => {
    setKitItems(prev => 
      prev.map(item => 
        item.id === id ? 
          { 
            ...item, 
            currentAmount: amount,
            ...(recommendedAmount !== undefined && { recommendedAmount })
          } 
          : item
      )
    );
  };

  // Update recommended amounts for food items
  const updateFoodItemsRecommendedAmounts = (items: SupplyItem[]) => {
    setFoodItems(prev => 
      prev.map(item => {
        const updatedItem = items.find(updated => updated.id === item.id);
        return updatedItem ? { 
          ...item, 
          recommendedAmount: updatedItem.recommendedAmount
        } : item;
      })
    );
  };

  // Calculate progress percentage for a list of items
  const calculateProgress = (items: SupplyItem[]): number => {
    if (items.length === 0) return 0;
    
    const totalRecommended = items.reduce((sum, item) => sum + item.recommendedAmount, 0);
    const totalCurrent = items.reduce((sum, item) => sum + Math.min(item.currentAmount, item.recommendedAmount), 0);
    
    return Math.floor((totalCurrent / totalRecommended) * 100);
  };

  // Get top priority items (items with the lowest completion percentage)
  const getPriorities = (): SupplyItem[] => {
    const allItems = [...foodItems, ...kitItems];
    
    // Calculate progress for each item
    const itemsWithProgress = allItems.map(item => ({
      ...item,
      progress: item.recommendedAmount > 0 ? (item.currentAmount / item.recommendedAmount) * 100 : 100
    }));
    
    // Sort by progress (lowest first) and take top 5
    return itemsWithProgress
      .filter(item => item.progress < 100) // Only items not at 100%
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        name: item.name,
        recommendedAmount: item.recommendedAmount,
        currentAmount: item.currentAmount,
        unit: item.unit,
        category: item.category,
        type: item.type
      }));
  };

  // Get counts of completed, in-progress, and not-started items
  const getCompletedCount = () => {
    const allItems = [...foodItems, ...kitItems];
    
    return {
      complete: allItems.filter(item => (item.currentAmount / item.recommendedAmount) >= 1).length,
      inProgress: allItems.filter(item => (item.currentAmount / item.recommendedAmount) > 0 && (item.currentAmount / item.recommendedAmount) < 1).length,
      notStarted: allItems.filter(item => item.currentAmount === 0).length
    };
  };

  // Calculate overall readiness score
  const getOverallScore = (): number => {
    const allItems = [...foodItems, ...kitItems];
    return calculateProgress(allItems);
  };

  const value = {
    foodItems,
    kitItems,
    updateFoodItem,
    updateKitItem,
    initializeFoodItems,
    initializeKitItems,
    updateFoodItemsRecommendedAmounts,
    calculateProgress,
    getPriorities,
    getCompletedCount,
    getOverallScore,
  };

  return (
    <SupplyContext.Provider value={value}>
      {children}
    </SupplyContext.Provider>
  );
};
