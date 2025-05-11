import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// API URL for Cloudflare Worker - make it a variable for easier configuration
// Note: For local development without a real Worker, set MOCK_AUTH=true
const MOCK_AUTH = false; // Set to false when you have a real Worker deployed

// Auth worker URL
const API_URL = 'https://auth-worker.petersenrj.workers.dev/api';

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
        const response = await fetch(`${API_URL}/data`, {
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          // If we can fetch user data, the user is authenticated
          const userData = await response.json();
          
          // Get user info from localStorage or from the API response
          let userInfo;
          const storedUserInfo = localStorage.getItem('user_info');
          
          if (storedUserInfo) {
            userInfo = JSON.parse(storedUserInfo);
          } else if (userData && userData.userId) {
            // If no stored user info but API returns data, create user info
            userInfo = {
              id: userData.userId,
              email: userData.email || '',
              name: userData.name || userData.email?.split('@')[0] || 'User'
            };
            localStorage.setItem('user_info', JSON.stringify(userInfo));
          }
          
          if (userInfo) {
            setUser(userInfo);
          }
        } else {
          // If unauthorized, clear any potentially invalid auth data
          localStorage.removeItem('user_info');
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any potentially invalid auth data
        localStorage.removeItem('user_info');
        localStorage.removeItem('auth_token');
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
          
          // Hard refresh the page after successful login
          window.location.href = '/';
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
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
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
      
      // Store the auth token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      // Additional step to get user profile information
      try {
        const userDataResponse = await fetch(`${API_URL}/data`, {
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${data.token || localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userDataResponse.ok) {
          // Get user name from DB or use email as fallback
          const userData = await userDataResponse.json();
          
          // Create user info object with available data
          const userInfo = {
            id: data.userId,
            email: email,
            name: userData.name || email.split('@')[0] // Fallback if name isn't provided
          };
          
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          setUser(userInfo);
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            variant: "default"
          });
          
          // Hard refresh the page after successful login
          window.location.href = '/';
          return true;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
      // Fallback if user data fetch fails - still log the user in
      const userInfo = {
        id: data.userId,
        email: email,
        name: email.split('@')[0] // Use first part of email as name
      };
      
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setUser(userInfo);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default"
      });
      
      // Hard refresh the page after successful login
      window.location.href = '/';
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
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
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
    if (!MOCK_AUTH) {
      // For real API, make a logout request to invalidate server-side session
      // We're ignoring 404 errors since the endpoint might not exist yet
      fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        // We don't care about the response, we'll log out locally anyway
        if (!response.ok && response.status !== 404) {
          console.error("Logout request failed:", response.status);
        }
      })
      .catch(err => console.error("Logout request error:", err));
    }
    
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_token');
    setUser(null);
    
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
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        mode: 'cors',
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
  
  // Reset password function (mocked)
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
      
      // Real password reset with Worker API
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
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
        
        // Clear local storage and user state
        localStorage.removeItem('user_info');
        setUser(null);
        
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
          variant: "default"
        });
        
        return true;
      }
      
      // Real delete account with Worker API (requires user to be logged in)
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete your account.",
          variant: "destructive"
        });
        return false;
      }
      
      const response = await fetch(`${API_URL}/api/delete-account`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
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
      
      // Clear local storage and user state
      localStorage.removeItem('user_info');
      setUser(null);
      
      // Optional: Clear cookie by setting an expired one
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
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
