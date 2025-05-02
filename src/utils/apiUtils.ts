
// API utilities for data fetching and storage

const API_URL = 'https://prepper-auth-worker.petersenrj.workers.dev/api';

export interface ApiResponse {
  kit: any[];
  storage: any[];
  report: any;
}

// Function to fetch all user data
export const fetchUserData = async (authToken: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty data structure on error
    return { kit: [], storage: [], report: null };
  }
};

// Function to save user data
export const saveUserData = async (
  authToken: string, 
  data: { kit: any[], storage: any[], report: any }
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save data');
    }

    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};
