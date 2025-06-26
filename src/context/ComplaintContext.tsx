import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  evidence?: string[];
  anonymous: boolean;
  timeline: Array<{
    date: Date;
    action: string;
    by: string;
  }>;
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Promise<string>;
  getComplaint: (id: string) => Promise<Complaint | null>;
  updateComplaint: (id: string, updates: Partial<Omit<Complaint, 'id' | 'createdAt'>>) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComplaints(data.map(complaint => ({
        ...complaint,
        createdAt: new Date(complaint.created_at),
        updatedAt: new Date(complaint.updated_at),
        timeline: complaint.timeline.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
      })));
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<string> => {
    try {
      const now = new Date();
      const id = `VG-${now.getFullYear()}-${uuidv4().substring(0, 4)}`;
      
      const newComplaint = {
        id,
        ...complaintData,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        timeline: [{
          date: now.toISOString(),
          action: 'Complaint filed',
          by: complaintData.anonymous ? 'Anonymous' : 'Citizen'
        }]
      };

      const { error } = await supabase
        .from('complaints')
        .insert([newComplaint]);

      if (error) throw error;

      await fetchComplaints(); // Refresh the complaints list
      return id;
    } catch (err) {
      console.error('Error adding complaint:', err);
      throw err;
    }
  };

  const getComplaint = async (id: string): Promise<Complaint | null> => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        timeline: data.timeline.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
      };
    } catch (err) {
      console.error('Error fetching complaint:', err);
      return null;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Omit<Complaint, 'id' | 'createdAt'>>): Promise<boolean> => {
    try {
      const now = new Date();
      const { error } = await supabase
        .from('complaints')
        .update({
          ...updates,
          updated_at: now.toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchComplaints(); // Refresh the complaints list
      return true;
    } catch (err) {
      console.error('Error updating complaint:', err);
      toast.error('Failed to update complaint');
      return false;
    }
  };

  return (
    <ComplaintContext.Provider value={{ 
      complaints, 
      addComplaint, 
      getComplaint, 
      updateComplaint,
      loading,
      error 
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};