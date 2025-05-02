
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// API URL for Cloudflare Worker - make it a variable for easier configuration
// Note: For local development without a real Worker, set MOCK_AUTH=true
const MOCK_AUTH = true; // Set to false when you have a real Worker deployed
const API_URL = MOCK_AUTH ? null : 'https://prepper-auth-worker.your-domain.workers.dev';

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
  
  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (MOCK_AUTH) {
          // Mock authentication check - look for stored user in localStorage
          const storedUser = localStorage.getItem('user_info');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setIsLoading(false);
          return;
        }
        
        // Real authentication check with Worker API
        const response = await fetch(`${API_URL}/api/data`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          // If we can fetch user data, the user is authenticated
          const userData = await response.json();
          // Get user info from localStorage (stored during login/signup)
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
          
          if (userInfo.id) {
            setUser(userInfo);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any potentially invalid auth data
        localStorage.removeItem('user_info');
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
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          setUser(userInfo);
          
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
      
      // Real login with Worker API
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
      
      // Assume additional user data like name would be returned in the response
      // or could be fetched in a separate call
      const userInfo = {
        id: data.userId,
        email: email,
        name: data.name || email.split('@')[0] // Fallback if name isn't provided
      };
      
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setUser(userInfo);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default"
      });
      
      return true;
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
        
        // Store in mock users and localStorage
        MOCK_USERS[userId] = userInfo;
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        setUser(userInfo);
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
          variant: "default"
        });
        
        return true;
      }
      
      // Real signup with Worker API
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
      
      const userInfo = {
        id: data.userId,
        email: email,
        name: name
      };
      
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setUser(userInfo);
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
        variant: "default"
      });
      
      return true;
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
    localStorage.removeItem('user_info');
    setUser(null);
    
    // Optional: Clear cookie by setting an expired one
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully",
      variant: "default"
    });
  };
  
  // Forgot password function (mocked)
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would typically call an API endpoint, but we'll mock it
      // In a real implementation, the worker would send an email with a reset link
      await new Promise(r => setTimeout(r, 1000)); // Fake delay
      
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
  
  // Reset password function (mocked)
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would typically call an API endpoint, but we'll mock it
      await new Promise(r => setTimeout(r, 1000)); // Fake delay
      
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
