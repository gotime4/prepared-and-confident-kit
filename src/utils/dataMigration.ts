
/**
 * Utility to migrate data from localStorage to server
 */
import { SupplyItem } from "@/contexts/SupplyContext";

/**
 * Migrate supply data from localStorage to server
 * @returns Object containing food and kit items from localStorage, or null if none found
 */
export function getLocalStorageSupplyData(): { foodItems: SupplyItem[], kitItems: SupplyItem[] } | null {
  const foodItems = localStorage.getItem('foodItems');
  const kitItems = localStorage.getItem('kitItems');
  
  if (!foodItems && !kitItems) {
    return null;
  }
  
  return {
    foodItems: foodItems ? JSON.parse(foodItems) : [],
    kitItems: kitItems ? JSON.parse(kitItems) : []
  };
}

/**
 * Clear localStorage data after successful migration
 */
export function clearLocalStorageSupplyData(): void {
  localStorage.removeItem('foodItems');
  localStorage.removeItem('kitItems');
}

/**
 * Migrate user data from localStorage to sessionStorage
 * @returns User data from localStorage, or null if none found
 */
export function migrateUserData(): any | null {
  const userInfo = localStorage.getItem('user_info');
  
  if (!userInfo) {
    return null;
  }
  
  // Move to sessionStorage
  sessionStorage.setItem('user_info', userInfo);
  
  // Clear from localStorage
  localStorage.removeItem('user_info');
  
  return JSON.parse(userInfo);
}
