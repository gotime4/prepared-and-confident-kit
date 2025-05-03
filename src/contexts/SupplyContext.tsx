import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
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
  peopleCount: number;
  setPeopleCount: (count: number) => void;
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

// Add these helper functions at the top before the SupplyProvider component
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

// Helper for comparing arrays of SupplyItems
const areSupplyItemsEqual = (arr1: SupplyItem[], arr2: SupplyItem[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  
  // Create maps for faster lookups
  const map1 = new Map<string, SupplyItem>();
  arr1.forEach(item => map1.set(item.id, item));
  
  // Compare each item from arr2 with corresponding item in arr1
  for (const item2 of arr2) {
    const item1 = map1.get(item2.id);
    if (!item1) return false;
    
    // Compare only the relevant properties
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

export const SupplyProvider: React.FC<SupplyProviderProps> = ({ children }) => {
  // Initialize with empty arrays
  const [foodItems, setFoodItems] = useState<SupplyItem[]>([]);
  const [kitItems, setKitItems] = useState<SupplyItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isSyncingRef = useRef(false);
  const lastSyncedStateRef = useRef<{ foodItems: SupplyItem[]; kitItems: SupplyItem[] }>({ foodItems: [], kitItems: [] });
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [peopleCount, setPeopleCount] = useState<number>(() => {
    const saved = localStorage.getItem('foodPeopleCount');
    return saved ? parseInt(saved) : 1;
  });

  // Add debugging info on mount
  useEffect(() => {
    console.log("SupplyProvider mounted. Auth state:", { 
      isAuthenticated, 
      hasUser: !!user,
      hasAuthToken: !!localStorage.getItem('auth_token')
    });
  }, [isAuthenticated, user]);

  // Load data from API when authenticated - this is the primary data source
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        console.log('Not authenticated, skipping data load');
        return;
      }
      
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.log('No auth token found, skipping data load');
        return;
      }
      
      setIsSyncing(true);
      isSyncingRef.current = true;
      try {
        console.log('Loading data from API...');
        const userData = await fetchUserData(authToken);
        console.log('API returned data:', userData);
        
        if (userData.storage && userData.storage.length > 0) {
          console.log(`Setting ${userData.storage.length} food items from API`);
          setFoodItems(userData.storage);
          localStorage.setItem('foodItems', JSON.stringify(userData.storage));
        }
        
        if (userData.kit && userData.kit.length > 0) {
          console.log(`Setting ${userData.kit.length} kit items from API`);
          setKitItems(userData.kit);
          localStorage.setItem('kitItems', JSON.stringify(userData.kit));
        }

        if (userData.peopleCount && !isNaN(userData.peopleCount)) {
          setPeopleCount(userData.peopleCount);
          localStorage.setItem('foodPeopleCount', String(userData.peopleCount));
        }
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Failed to load data from API:', error);
        toast({
          title: "Data Sync Error",
          description: "Failed to load your data. Using local data instead.",
          variant: "destructive"
        });
        // We'll fall back to localStorage below
      } finally {
        setIsSyncing(false);
        isSyncingRef.current = false;
      }
    };
    
    loadData();
  }, [isAuthenticated]);

  // Fallback to localStorage if no API data
  useEffect(() => {
    if (isDataLoaded) return;
    
    const loadFromLocalStorage = () => {
      if (foodItems.length === 0) {
        const savedFoodItems = localStorage.getItem('foodItems');
        if (savedFoodItems) {
          try {
            const parsedItems = JSON.parse(savedFoodItems);
            console.log(`Setting ${parsedItems.length} food items from localStorage`);
            setFoodItems(parsedItems);
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
            console.log(`Setting ${parsedItems.length} kit items from localStorage`);
            setKitItems(parsedItems);
          } catch (e) {
            console.error('Error parsing kit items from localStorage:', e);
          }
        }
      }
    };
    
    loadFromLocalStorage();
  }, [isDataLoaded, foodItems.length, kitItems.length]);

  // Save peopleCount to localStorage on change
  useEffect(() => {
    localStorage.setItem('foodPeopleCount', String(peopleCount));
  }, [peopleCount]);

  // Function to save data to the database
  const saveDataToDb = useCallback(async () => {
    console.log('saveDataToDb called with auth state:', { 
      isAuthenticated, 
      hasUser: !!user,
      userInfo: user ? `${user.name} (${user.email})` : 'no user'
    });
    
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping data save');
      return;
    }
    
    const authToken = localStorage.getItem('auth_token');
    console.log('Auth token check:', authToken ? 'Token found' : 'No token found');
    
    if (!authToken) {
      console.log('No auth token found, skipping data save');
      return;
    }
    
    setIsSyncing(true);
    isSyncingRef.current = true;
    try {
      console.log('Attempting to save data to server...');
      const result = await saveUserData(authToken, {
        kit: kitItems,
        storage: foodItems,
        peopleCount,
        report: null // For future report data
      });
      
      if (result) {
        console.log('Data saved to database successfully');
        toast({
          title: "Data Synced",
          description: "Your data has been saved to the cloud",
          variant: "default"
        });
        lastSyncedStateRef.current = { foodItems, kitItems };
      } else {
        console.error('Failed to save data to database');
        toast({
          title: "Sync Error",
          description: "Failed to sync your data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      isSyncingRef.current = false;
    }
  }, [isAuthenticated, user, kitItems, foodItems, peopleCount]);

  // Save to database whenever items change and user is authenticated
  useEffect(() => {
    // Skip initial render or when no data
    if (!isDataLoaded || (foodItems.length === 0 && kitItems.length === 0)) {
      return;
    }
    
    if (isAuthenticated && !isSyncingRef.current) {
      const hasStateChanged =
        !areSupplyItemsEqual(lastSyncedStateRef.current.foodItems, foodItems) ||
        !areSupplyItemsEqual(lastSyncedStateRef.current.kitItems, kitItems);

      if (hasStateChanged) {
        console.log('Items changed, scheduling sync to server...');
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        syncTimeoutRef.current = setTimeout(() => {
          saveDataToDb();
        }, 1000); // Debounce to prevent too many API calls
      } else {
        console.log('No changes detected, skipping sync');
      }
    } else {
      console.log('Not authenticated or already syncing, not saving to server');
    }
  }, [foodItems, kitItems, isAuthenticated, isDataLoaded, saveDataToDb]);

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

  // Memoized and guarded context setters
  const updateFoodItem = useCallback((id: string, amount: number) => {
    setFoodItems(prev => {
      const updated = prev.map(item =>
        item.id === id && item.currentAmount !== amount
          ? { ...item, currentAmount: amount }
          : item
      );
      return areSupplyItemsEqual(prev, updated) ? prev : updated;
    });
  }, []);

  const updateKitItem = useCallback((id: string, amount: number, recommendedAmount?: number) => {
    setKitItems(prev => {
      const updated = prev.map(item =>
        item.id === id && (item.currentAmount !== amount || (recommendedAmount !== undefined && item.recommendedAmount !== recommendedAmount))
          ? { ...item, currentAmount: amount, ...(recommendedAmount !== undefined && { recommendedAmount }) }
          : item
      );
      return areSupplyItemsEqual(prev, updated) ? prev : updated;
    });
  }, []);

  const initializeFoodItems = useCallback((items: SupplyItem[]) => {
    setFoodItems(prev => (prev.length === 0 && items.length > 0 ? items : prev));
  }, []);

  const initializeKitItems = useCallback((items: SupplyItem[]) => {
    setKitItems(prev => (prev.length === 0 && items.length > 0 ? items : prev));
  }, []);

  const updateFoodItemsRecommendedAmounts = useCallback((items: SupplyItem[]) => {
    setFoodItems(prev => {
      let changed = false;
      const updated = prev.map(item => {
        const updatedItem = items.find(updated => updated.id === item.id);
        if (updatedItem && item.recommendedAmount !== updatedItem.recommendedAmount) {
          changed = true;
          return { ...item, recommendedAmount: updatedItem.recommendedAmount };
        }
        return item;
      });
      return changed ? updated : prev;
    });
  }, []);

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
    peopleCount,
    setPeopleCount,
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
