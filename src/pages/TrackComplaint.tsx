import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useComplaints, Complaint } from '../context/ComplaintContext';
import { useUser } from '../context/UserContext';
import FeedbackForm from '../components/feedback/FeedbackForm';

const TrackComplaint: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { complaints, getComplaint } = useComplaints();
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    const complaintId = location.state?.complaintId;
    if (complaintId) {
      setSearchId(complaintId);
      handleSearch(complaintId);
    }
  }, [location.state]);

  const handleSearch = async (id: string = searchId) => {
    try {
      const complaint = await getComplaint(id);
      if (complaint) {
        setSearchResult(complaint);
        setNotFound(false);
      } else {
        setSearchResult(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      setSearchResult(null);
      setNotFound(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSlaInfo = (complaint: Complaint) => {
    const createdDate = new Date(complaint.createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let slaTarget = 30; // Default SLA in days
    
    switch (complaint.priority) {
      case 'high':
        slaTarget = 15;
        break;
      case 'medium':
        slaTarget = 30;
        break;
      case 'low':
        slaTarget = 45;
        break;
    }
    
    const daysLeft = slaTarget - diffDays;
    const percentComplete = Math.min((diffDays / slaTarget) * 100, 100);
    
    return {
      daysLeft,
      percentComplete,
      isOverdue: daysLeft < 0 && complaint.status !== 'resolved'
    };
  };

  const getResolutionDetails = (complaint: Complaint) => {
    if (complaint.status === 'resolved' && complaint.timeline) {
      const resolutionEntry = complaint.timeline.find(entry => 
        entry.action.includes('resolved') && entry.details
      );
      return resolutionEntry?.details;
    }
    return null;
  };

  const canProvideFeedback = (complaint: Complaint) => {
    return (
      user && // User is logged in
      complaint.status === 'resolved' && // Complaint is resolved
      complaint.user_id === user.id && // User owns the complaint
      !complaint.feedback // No feedback provided yet
    );
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Complaint</h1>
          <p className="mt-2 text-gray-600">
            Enter your complaint ID to check the status and progress.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g., VG-2023-1001)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleSearch()}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="h-5 w-5 mr-2" />
              Track Complaint
            </button>
          </div>
        </div>

        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-8"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  No complaint found with ID <span className="font-semibold">{searchId}</span>. Please check the ID and try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-800 px-6 py-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{searchResult.title}</h2>
                    <p className="text-blue-100">Complaint ID: {searchResult.id}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status || '')}`}>
                      {getStatusIcon(searchResult.status || '')}
                      <span className="ml-1 capitalize">{(searchResult.status || '').replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{searchResult.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{searchResult.department}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{searchResult.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Filed On</dt>
                    <dd className="mt-1 text-sm text-gray-900">{format(new Date(searchResult.createdAt), 'PPP')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{searchResult.priority}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{searchResult.description}</p>
                </div>

                {/* Resolution Details */}
                {searchResult.status === 'resolved' && (
                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-3">Resolution Details</h3>
                    {getResolutionDetails(searchResult) ? (
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                          <div>
                            <dt className="text-sm font-medium text-green-800">Action Taken</dt>
                            <dd className="mt-1 text-sm text-green-700">
                              {getResolutionDetails(searchResult)?.actionTaken}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                          <div>
                            <dt className="text-sm font-medium text-green-800">Resolution Date</dt>
                            <dd className="mt-1 text-sm text-green-700">
                              {format(new Date(getResolutionDetails(searchResult)?.resolutionDate || ''), 'PPP')}
                            </dd>
                          </div>
                        </div>
                        {getResolutionDetails(searchResult)?.additionalNotes && (
                          <div className="mt-2 text-sm text-green-700">
                            <dt className="font-medium text-green-800">Additional Notes</dt>
                            <dd className="mt-1">
                              {getResolutionDetails(searchResult)?.additionalNotes}
                            </dd>
                          </div>
                        )}
                        {canProvideFeedback(searchResult) && (
                          <button
                            onClick={() => setShowFeedback(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Provide Feedback
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-green-700">This complaint has been marked as resolved.</p>
                    )}
                  </div>
                )}

                {/* SLA Progress */}
                {searchResult.status !== 'resolved' && searchResult.status !== 'rejected' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">SLA Progress</h3>
                    {(() => {
                      const { daysLeft, percentComplete, isOverdue } = getSlaInfo(searchResult);
                      return (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${isOverdue ? 'bg-red-600' : 'bg-blue-600'}`} 
                              style={{ width: `${percentComplete}%` }}
                            ></div>
                          </div>
                          <p className={`mt-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            {isOverdue 
                              ? `Overdue by ${Math.abs(daysLeft)} days` 
                              : `${daysLeft} days remaining for resolution`
                            }
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Timeline */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Timeline</h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {searchResult.timeline.map((timelineItem, itemIdx) => (
                        <li key={itemIdx}>
                          <div className="relative pb-8">
                            {itemIdx !== searchResult.timeline.length - 1 && (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200\" aria-hidden="true"></span>
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                                  <Clock className="h-5 w-5 text-blue-600" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {timelineItem.action}
                                  </p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <time dateTime={new Date(timelineItem.date).toISOString()}>
                                    {format(new Date(timelineItem.date), 'PPp')}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-1 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <span className="text-xs text-blue-800 font-medium">
                      Verified on blockchain · Last updated {format(new Date(searchResult.updatedAt), 'PPp')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent complaints section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Public Complaints</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {complaints
              .filter(complaint => !complaint.anonymous)
              .slice(0, 5)
              .map((complaint) => (
                <li key={complaint.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        getStatusColor(complaint.status || '').split(' ')[0]
                      }`}>
                        {getStatusIcon(complaint.status || '')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{complaint.title}</p>
                        <p className="text-sm text-gray-500">
                          {complaint.department} · {complaint.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSearchId(complaint.id);
                        handleSearch(complaint.id);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View details
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <Link to="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all public complaints →
            </Link>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && searchResult && canProvideFeedback(searchResult) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-lg w-full mx-4">
            <FeedbackForm
              complaintId={searchResult.id}
              onClose={() => setShowFeedback(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;