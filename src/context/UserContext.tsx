import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'citizen' | 'admin';
  department?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, loginType?: 'citizen' | 'admin', department?: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession();
    const userData = session.data?.session?.user;
    if (userData) {
      setUser({
        ...userData,
        role: userData.user_metadata?.role || 'citizen',
        department: userData.user_metadata?.department,
        name: userData.user_metadata?.name
      });
    }
    setLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userData = session?.user;
      if (userData) {
        setUser({
          ...userData,
          role: userData.user_metadata?.role || 'citizen',
          department: userData.user_metadata?.department,
          name: userData.user_metadata?.name
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, loginType: 'citizen' | 'admin' = 'citizen', department?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Update user metadata with role and department
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            role: loginType,
            department: loginType === 'admin' ? department : undefined
          }
        });

        if (updateError) throw updateError;

        setUser({
          ...data.user,
          role: loginType,
          department: loginType === 'admin' ? department : undefined
        });

        toast.success('Successfully logged in!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'citizen'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Successfully signed up! Please check your email for verification.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to sign up. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout.');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};