// API utilities for data fetching and storage

const API_URL = 'https://auth-worker.petersenrj.workers.dev/api';

export interface ApiResponse {
  kit?: any[];
  storage?: any[];
  report?: any;
  [key: string]: any;
}

export interface SaveUserDataPayload {
  kit: any[];
  storage: any[];
  report: any;
  peopleCount?: number;
  kitPeopleCount?: number;
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
      // Ensure we're not using cached data
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data fetched successfully. Response contains:', 
      Object.keys(data).join(', '), 
      'Has kit:', !!data.kit, 
      'Has storage:', !!data.storage
    );
    
    // Return the data with default empty arrays if kit/storage are missing
    return {
      ...data,
      kit: data.kit || [],
      storage: data.storage || [],
      report: data.report || null
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty data structure on error
    return { kit: [], storage: [], report: null };
  }
};

// Function to save user data
export const saveUserData = async (
  authToken: string, 
  data: SaveUserDataPayload
): Promise<boolean> => {
  try {
    console.log('Saving data to API...');
    
    // Add timestamp to help see when data was updated
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Making fetch request to API_URL:', API_URL);
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error(`Failed to save data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Data saved successfully', result);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};
