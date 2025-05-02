
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
    console.log('Fetching data from API with token:', authToken.substring(0, 10) + '...');
    
    const response = await fetch(`${API_URL}/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data fetched successfully:', data ? 'Data present' : 'No data');
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
    console.log('Saving data to API...');
    
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`Failed to save data: ${response.status}`);
    }

    console.log('Data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};
