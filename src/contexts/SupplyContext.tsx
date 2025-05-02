
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserData, saveUserData } from '@/utils/apiUtils';
import { toast } from "@/components/ui/use-toast";

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
  isSyncing: boolean;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Function to save data to the database
  const saveDataToDb = async () => {
    if (!isAuthenticated || !user) return;
    
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) return;
    
    setIsSyncing(true);
    try {
      await saveUserData(authToken, {
        kit: kitItems,
        storage: foodItems,
        report: null // For future report data
      });
    } catch (error) {
      console.error('Failed to save data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Load data from API when authenticated - this is the primary data source
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) return;
      
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) return;
      
      setIsSyncing(true);
      try {
        const userData = await fetchUserData(authToken);
        
        // Only set data if we have items from the API
        if (userData.storage && userData.storage.length > 0) {
          setFoodItems(userData.storage);
          // Save to localStorage as backup
          localStorage.setItem('foodItems', JSON.stringify(userData.storage));
        }
        
        if (userData.kit && userData.kit.length > 0) {
          setKitItems(userData.kit);
          // Save to localStorage as backup
          localStorage.setItem('kitItems', JSON.stringify(userData.kit));
        }
        
        // Mark data as loaded from API
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Failed to load data from API:', error);
        // Don't show error toast on initial load, we'll fallback to localStorage
      } finally {
        setIsSyncing(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, user]);

  // Fallback to localStorage if no API data - ONLY if API load hasn't succeeded
  useEffect(() => {
    // Only load from localStorage if API data fetch is complete but returned no data
    if (isDataLoaded) return;
    
    const loadFromLocalStorage = () => {
      if (foodItems.length === 0) {
        const savedFoodItems = localStorage.getItem('foodItems');
        if (savedFoodItems) {
          try {
            const parsedItems = JSON.parse(savedFoodItems);
            setFoodItems(parsedItems);
            console.log('Loaded food items from localStorage');
          } catch (e) {
            console.error('Error parsing food items from localStorage:', e);
          }
        }
      }
      
      if (kitItems.length === 0) {
        const savedKitItems = localStorage.getItem('kitItems');
        if (savedKitItems) {
          try {
            const parsedItems = JSON.parse(savedKitItems);
            setKitItems(parsedItems);
            console.log('Loaded kit items from localStorage');
          } catch (e) {
            console.error('Error parsing kit items from localStorage:', e);
          }
        }
      }
    };
    
    // Add a slight delay to ensure API had a chance to load first
    const timer = setTimeout(() => {
      loadFromLocalStorage();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isDataLoaded, foodItems.length, kitItems.length]);

  // Save to database whenever items change and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && (foodItems.length > 0 || kitItems.length > 0)) {
      // Don't sync immediately on first load
      if (!isDataLoaded) {
        setIsDataLoaded(true);
        return;
      }
      
      const debounceTimer = setTimeout(() => {
        console.log('Syncing data to server...');
        saveDataToDb();
      }, 1000); // Debounce to prevent too many API calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [foodItems, kitItems, isAuthenticated, user, isDataLoaded]);

  // Also save to localStorage as fallback
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
    isSyncing,
  };

  return (
    <SupplyContext.Provider value={value}>
      {children}
    </SupplyContext.Provider>
  );
};
