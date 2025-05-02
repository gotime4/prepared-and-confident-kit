
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { hashPassword } from '@/utils/crypto';

// API URL for Cloudflare Worker - make it a variable for easier configuration
// Note: For local development without a real Worker, set MOCK_AUTH=true
const MOCK_AUTH = false; // Set to false when you have a real Worker deployed
const API_URL = MOCK_AUTH ? null : 'https://prepper-auth-worker.petersenrj.workers.dev';

// Define types for user and context
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS: Record<string, User> = {
  '1': { id: '1', name: 'Test User', email: 'test@example.com' }
};

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (MOCK_AUTH) {
          // Mock authentication check - look for stored user in sessionStorage
          const storedUser = sessionStorage.getItem('user_info');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setIsLoading(false);
          return;
        }
        
        // Get token from sessionStorage
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        setAuthToken(token);
        
        // Real authentication check with Worker API
        const response = await fetch(`${API_URL}/api/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // If we can fetch user data, the user is authenticated
          const userData = await response.json();
          
          if (userData && userData.user) {
            setUser(userData.user);
          }
        } else {
          // Invalid token, clear it
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user_info');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any potentially invalid auth data
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_info');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (MOCK_AUTH) {
        // Mock login for development
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Basic validation
        if (email === 'test@example.com' && password === 'password') {
          const userInfo = MOCK_USERS['1'];
          sessionStorage.setItem('user_info', JSON.stringify(userInfo));
          sessionStorage.setItem('auth_token', 'mock-token-12345');
          setUser(userInfo);
          setAuthToken('mock-token-12345');
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            variant: "default"
          });
          
          return true;
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // Hash the password before sending to server
      const hashedPassword = await hashPassword(password, email);
      
      // Real login with Worker API
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, hashedPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
        return false;
      }
      
      // Store the JWT token
      if (data.token) {
        sessionStorage.setItem('auth_token', data.token);
        setAuthToken(data.token);
      }
      
      // Set user data
      if (data.user) {
        sessionStorage.setItem('user_info', JSON.stringify(data.user));
        setUser(data.user);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default"
        });
        
        return true;
      }
      
      // Fallback if user data isn't included in login response
      try {
        const userDataResponse = await fetch(`${API_URL}/api/data`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();
          
          if (userData && userData.user) {
            sessionStorage.setItem('user_info', JSON.stringify(userData.user));
            setUser(userData.user);
            
            toast({
              title: "Login Successful",
              description: "Welcome back!",
              variant: "default"
            });
            
            return true;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
      // If we reached here, something went wrong
      toast({
        title: "Login Error",
        description: "Failed to retrieve user data",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (MOCK_AUTH) {
        // Mock signup for development
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Create a new mock user
        const userId = Date.now().toString();
        const userInfo = {
          id: userId,
          email: email,
          name: name
        };
        
        // Store in mock users and sessionStorage
        MOCK_USERS[userId] = userInfo;
        sessionStorage.setItem('user_info', JSON.stringify(userInfo));
        sessionStorage.setItem('auth_token', 'mock-token-' + userId);
        setUser(userInfo);
        setAuthToken('mock-token-' + userId);
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
          variant: "default"
        });
        
        return true;
      }
      
      // Hash the password before sending to server
      const hashedPassword = await hashPassword(password, email);
      
      // Real signup with Worker API
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, hashedPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.error || "Couldn't create account",
          variant: "destructive"
        });
        return false;
      }
      
      // Store the JWT token
      if (data.token) {
        sessionStorage.setItem('auth_token', data.token);
        setAuthToken(data.token);
      }
      
      // Set user data
      if (data.user) {
        sessionStorage.setItem('user_info', JSON.stringify(data.user));
        setUser(data.user);
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
          variant: "default"
        });
        
        return true;
      }
      
      toast({
        title: "Signup Error",
        description: "Failed to create account",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    if (!MOCK_AUTH && authToken) {
      // For real API, make a logout request to invalidate server-side session
      fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).catch(err => console.error("Logout request error:", err));
    }
    
    // Clear session data
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_info');
    setAuthToken(null);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully",
      variant: "default"
    });
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (MOCK_AUTH) {
        // Mock forgot password flow
        await new Promise(r => setTimeout(r, 1000)); // Fake delay
        
        toast({
          title: "Password Reset Email Sent",
          description: "If an account exists with that email, you'll receive a reset link",
          variant: "default"
        });
        
        return true;
      }
      
      // Real forgot password with Worker API
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to process password reset request",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists with that email, you'll receive a reset link",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Error",
        description: "Failed to process password reset request",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (MOCK_AUTH) {
        // Mock reset password flow
        await new Promise(r => setTimeout(r, 1000)); // Fake delay
        
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated",
          variant: "default"
        });
        
        return true;
      }
      
      // Hash the new password
      // For reset password, we need a different approach since we don't have the email
      // We'll hash with a fixed value and let the server handle the security
      const hashedPassword = await hashPassword(password, token); // Using token as salt
      
      // Real password reset with Worker API
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, hashedPassword }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to reset password",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete account function
  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (MOCK_AUTH) {
        // Mock delete account for development
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Remove user from mock storage
        if (user && user.id) {
          delete MOCK_USERS[user.id];
        }
        
        // Clear session data
        sessionStorage.removeItem('user_info');
        sessionStorage.removeItem('auth_token');
        setUser(null);
        setAuthToken(null);
        
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
          variant: "default"
        });
        
        return true;
      }
      
      // Real delete account with Worker API (requires user to be logged in)
      if (!user || !authToken) {
        toast({
          title: "Error",
          description: "You must be logged in to delete your account.",
          variant: "destructive"
        });
        return false;
      }
      
      const response = await fetch(`${API_URL}/api/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Delete Account Failed",
          description: data.error || "Couldn't delete account",
          variant: "destructive"
        });
        return false;
      }
      
      // Clear session data
      sessionStorage.removeItem('user_info');
      sessionStorage.removeItem('auth_token');
      setUser(null);
      setAuthToken(null);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    deleteAccount,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
