import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useComplaints } from '../context/ComplaintContext';
import { Edit2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ResolutionDetails {
  actionTaken: string;
  officerName: string;
  resolutionDate: string;
  additionalNotes?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const { complaints, updateComplaint } = useComplaints();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'complaints' | 'profile'>('complaints');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState<ResolutionDetails>({
    actionTaken: '',
    officerName: '',
    resolutionDate: new Date().toISOString().split('T')[0],
    additionalNotes: ''
  });

  useEffect(() => {
    if (!user?.role || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const departmentComplaints = complaints.filter(
    complaint => complaint.department === user?.department
  );

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    if (newStatus === 'resolved') {
      setShowResolutionModal(true);
      return;
    }

    try {
      const success = await updateComplaint(complaintId, {
        status: newStatus as any,
        timeline: [{
          date: new Date(),
          action: `Status updated to ${newStatus}`,
          by: `${user?.department} Admin`
        }]
      });

      if (success) {
        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleResolutionSubmit = async () => {
    if (!selectedComplaint) return;

    try {
      const success = await updateComplaint(selectedComplaint, {
        status: 'resolved',
        timeline: [{
          date: new Date(resolutionDetails.resolutionDate),
          action: `Complaint resolved - ${resolutionDetails.actionTaken}`,
          by: resolutionDetails.officerName,
          details: {
            ...resolutionDetails,
            department: user?.department
          }
        }]
      });

      if (success) {
        setSelectedComplaint(null);
        setShowResolutionModal(false);
        setResolutionDetails({
          actionTaken: '',
          officerName: '',
          resolutionDate: new Date().toISOString().split('T')[0],
          additionalNotes: ''
        });
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {user?.department} Admin Dashboard
            </h1>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('complaints')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'complaints'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Department Complaints
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin Profile
              </button>
            </nav>
          </div>

          {activeTab === 'complaints' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filed On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departmentComplaints.map((complaint) => (
                      <tr key={complaint.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {complaint.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            complaint.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : complaint.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : complaint.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            complaint.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : complaint.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(complaint.createdAt), 'PPP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedComplaint === complaint.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Clock className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                                className="text-green-600 hover:text-green-800"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(complaint.id, 'rejected')}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedComplaint(complaint.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Action Taken</label>
                <textarea
                  value={resolutionDetails.actionTaken}
                  onChange={(e) => setResolutionDetails(prev => ({ ...prev, actionTaken: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                  placeholder="Describe the actions taken to resolve the complaint"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Officer Name</label>
                <input
                  type="text"
                  value={resolutionDetails.officerName}
                  onChange={(e) => setResolutionDetails(prev => ({ ...prev, officerName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Name of the resolving officer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resolution Date</label>
                <input
                  type="date"
                  value={resolutionDetails.resolutionDate}
                  onChange={(e) => setResolutionDetails(prev => ({ ...prev, resolutionDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  value={resolutionDetails.additionalNotes}
                  onChange={(e) => setResolutionDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={2}
                  placeholder="Any additional information or notes"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowResolutionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolutionSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;