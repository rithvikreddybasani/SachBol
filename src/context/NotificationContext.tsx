import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Bell, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  userId: string;
  complaintId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  complaintTitle?: string;
  resolutionDetails?: {
    actionTaken: string;
    resolutionDate: string;
    additionalNotes?: string;
    department: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Subscribe to complaint status changes
    const subscription = supabase
      .channel('complaint-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'complaints',
        filter: 'status=neq.pending'
      }, async (payload) => {
        const complaint = payload.new;
        const latestTimeline = complaint.timeline[complaint.timeline.length - 1];
        
        // Create notification message based on status
        let message = '';
        let ToastIcon = Bell;
        let toastBgColor = 'bg-white';
        
        if (complaint.status === 'resolved') {
          message = `Your complaint "${complaint.title}" has been resolved by ${latestTimeline.details.department}`;
          if (latestTimeline?.details?.actionTaken) {
            message += `. Action taken: ${latestTimeline.details.actionTaken}`;
          }
          ToastIcon = CheckCircle;
          toastBgColor = 'bg-green-50';
        } else {
          message = `Status of complaint "${complaint.title}" has been updated to ${complaint.status}`;
        }

        // Create notification
        const resolutionDetails = latestTimeline?.details ? {
          actionTaken: latestTimeline.details.actionTaken,
          resolutionDate: latestTimeline.details.resolutionDate,
          additionalNotes: latestTimeline.details.additionalNotes,
          department: latestTimeline.details.department
        } : undefined;

        const notification = {
          id: `notif-${Date.now()}`,
          userId: complaint.user_id,
          complaintId: complaint.id,
          message,
          complaintTitle: complaint.title,
          read: false,
          createdAt: new Date(),
          resolutionDetails
        };

        setNotifications(prev => [notification, ...prev]);
        
        // Show toast notification
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full ${toastBgColor} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <ToastIcon className={`h-5 w-5 ${complaint.status === 'resolved' ? 'text-green-500' : 'text-blue-500'}`} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {complaint.status === 'resolved' ? 'Complaint Resolved' : 'Status Update'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right'
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};