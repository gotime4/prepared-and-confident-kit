
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "@/components/ui/use-toast";

// API URL for Cloudflare Worker - make it a variable for easier configuration
const API_URL = 'https://prepper-auth-worker.petersenrj.workers.dev';
const MOCK_API = false; // Set to false when you have a real Worker deployed

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
  isLoading: boolean;
  syncData: () => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [dataChanged, setDataChanged] = useState(false);
  
  // Get auth context for token access
  const { user, isAuthenticated } = useAuth();
  
  // Helper to get auth token
  const getAuthToken = (): string | null => {
    return sessionStorage.getItem('auth_token');
  };
  
  // Load data from API on component mount or when auth state changes
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      if (MOCK_API) {
        // Check localStorage as a fallback during development
        const savedFoodItems = localStorage.getItem('foodItems');
        const savedKitItems = localStorage.getItem('kitItems');
        
        if (savedFoodItems) {
          setFoodItems(JSON.parse(savedFoodItems));
        }
        
        if (savedKitItems) {
          setKitItems(JSON.parse(savedKitItems));
        }
        
        setIsLoading(false);
        return;
      }
      
      try {
        const token = getAuthToken();
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/api/supplies`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.foodItems) {
            setFoodItems(data.foodItems);
          }
          
          if (data.kitItems) {
            setKitItems(data.kitItems);
          }
        } else {
          console.error('Failed to fetch supply data');
          // If API fails, try localStorage as fallback
          const savedFoodItems = localStorage.getItem('foodItems');
          const savedKitItems = localStorage.getItem('kitItems');
          
          if (savedFoodItems) {
            setFoodItems(JSON.parse(savedFoodItems));
          }
          
          if (savedKitItems) {
            setKitItems(JSON.parse(savedKitItems));
          }
        }
      } catch (error) {
        console.error('Error fetching supply data:', error);
        // If API fails, try localStorage as fallback
        const savedFoodItems = localStorage.getItem('foodItems');
        const savedKitItems = localStorage.getItem('kitItems');
        
        if (savedFoodItems) {
          setFoodItems(JSON.parse(savedFoodItems));
        }
        
        if (savedKitItems) {
          setKitItems(JSON.parse(savedKitItems));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);
  
  // Save data to API whenever items change
  useEffect(() => {
    const saveData = async () => {
      if (!isAuthenticated || !user || !dataChanged) {
        return;
      }
      
      if (MOCK_API) {
        // Save to localStorage as a fallback during development
        if (foodItems.length > 0) {
          localStorage.setItem('foodItems', JSON.stringify(foodItems));
        }
        
        if (kitItems.length > 0) {
          localStorage.setItem('kitItems', JSON.stringify(kitItems));
        }
        
        setDataChanged(false);
        return;
      }
      
      try {
        const token = getAuthToken();
        if (!token) {
          return;
        }
        
        const response = await fetch(`${API_URL}/api/supplies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            foodItems,
            kitItems
          })
        });
        
        if (!response.ok) {
          console.error('Failed to save supply data');
          // Save to localStorage as a fallback
          if (foodItems.length > 0) {
            localStorage.setItem('foodItems', JSON.stringify(foodItems));
          }
          
          if (kitItems.length > 0) {
            localStorage.setItem('kitItems', JSON.stringify(kitItems));
          }
        }
      } catch (error) {
        console.error('Error saving supply data:', error);
        // Save to localStorage as a fallback
        if (foodItems.length > 0) {
          localStorage.setItem('foodItems', JSON.stringify(foodItems));
        }
        
        if (kitItems.length > 0) {
          localStorage.setItem('kitItems', JSON.stringify(kitItems));
        }
      } finally {
        setDataChanged(false);
      }
    };
    
    saveData();
  }, [foodItems, kitItems, isAuthenticated, user, dataChanged]);
  
  // Manually sync data with server
  const syncData = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return false;
      }
      
      const response = await fetch(`${API_URL}/api/supplies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foodItems,
          kitItems
        })
      });
      
      if (response.ok) {
        toast({
          title: "Data Synchronized",
          description: "Your supply data has been saved to the server",
          variant: "default"
        });
        return true;
      } else {
        toast({
          title: "Sync Failed",
          description: "Failed to synchronize supply data",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error syncing supply data:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred while syncing data",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize food items (for first time setup)
  const initializeFoodItems = (items: SupplyItem[]) => {
    // Only initialize if we don't already have items
    if (foodItems.length === 0) {
      setFoodItems(items);
      setDataChanged(true);
    }
  };

  // Initialize kit items (for first time setup)
  const initializeKitItems = (items: SupplyItem[]) => {
    // Only initialize if we don't already have items
    if (kitItems.length === 0) {
      setKitItems(items);
      setDataChanged(true);
    }
  };

  // Update a food item's current amount
  const updateFoodItem = (id: string, amount: number) => {
    setFoodItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, currentAmount: amount } : item
      )
    );
    setDataChanged(true);
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
    setDataChanged(true);
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
    setDataChanged(true);
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
    isLoading,
    syncData
  };

  return (
    <SupplyContext.Provider value={value}>
      {children}
    </SupplyContext.Provider>
  );
};
