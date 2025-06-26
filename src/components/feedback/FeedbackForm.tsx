import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface FeedbackFormProps {
  complaintId: string;
  onClose: () => void;
}

type FeedbackData = {
  rating: number;
  comment: string;
  satisfaction: 'satisfied' | 'neutral' | 'dissatisfied';
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ complaintId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<FeedbackData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedbackEmail = async (feedbackData: FeedbackData, complaintDetails: any) => {
    try {
      const emailContent = {
        to: 'rithvikreddybasani@gmail.com',
        subject: `New Feedback Received for Complaint ${complaintId}`,
        html: `
          <h2>New Feedback Received</h2>
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Complaint Title:</strong> ${complaintDetails.title}</p>
          <p><strong>Department:</strong> ${complaintDetails.department}</p>
          <p><strong>Rating:</strong> ${rating} stars</p>
          <p><strong>Satisfaction Level:</strong> ${feedbackData.satisfaction}</p>
          <p><strong>Comments:</strong> ${feedbackData.comment || 'No comments provided'}</p>
          <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
        `
      };

      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailContent
      });

      if (emailError) throw emailError;
    } catch (error) {
      console.error('Error sending feedback email:', error);
      // Don't throw error here to prevent blocking the feedback submission
    }
  };

  const onSubmit = async (data: FeedbackData) => {
    setIsSubmitting(true);
    try {
      // Get complaint details first
      const { data: complaintDetails, error: complaintError } = await supabase
        .from('complaints')
        .select('title, department')
        .eq('id', complaintId)
        .single();

      if (complaintError) throw complaintError;

      // Insert feedback
      const { error: feedbackError } = await supabase
        .from('feedback')
        .insert([
          {
            complaint_id: complaintId,
            rating: rating,
            comment: data.comment,
            satisfaction: data.satisfaction
          }
        ]);

      if (feedbackError) throw feedbackError;

      // Send email notification
      await sendFeedbackEmail(data, complaintDetails);

      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Feedback</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate your experience
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How satisfied are you with the resolution?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['satisfied', 'neutral', 'dissatisfied'].map((option) => (
              <label
                key={option}
                className={`flex items-center justify-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium cursor-pointer ${
                  errors.satisfaction
                    ? 'border-red-300'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <input
                  type="radio"
                  {...register('satisfaction', { required: true })}
                  value={option}
                  className="sr-only"
                />
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
          {errors.satisfaction && (
            <p className="mt-1 text-sm text-red-600">Please select your satisfaction level</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Share your thoughts about the resolution process..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;