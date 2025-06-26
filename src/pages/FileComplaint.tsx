import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Camera, Mic, Upload, FilePlus, AlertTriangle, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useComplaints } from '../context/ComplaintContext';

type FormData = {
  title: string;
  description: string;
  category: string;
  department: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  evidence?: FileList;
  anonymous: boolean;
  language: string;
};

const FileComplaint: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      department: '',
      location: '',
      priority: 'medium',
      anonymous: false,
      language: 'english'
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, upload evidence files to server and get URLs
      const evidenceUrls = uploadedFiles.map(file => URL.createObjectURL(file));
      
      // Add complaint to context
      const complaintId = await addComplaint({
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        location: data.location,
        status: 'pending',
        priority: data.priority,
        evidence: evidenceUrls,
        anonymous: data.anonymous
      });

      toast.success('Complaint filed successfully!');
      navigate('/track-complaint', { state: { complaintId } });
    } catch (error) {
      console.error('Error filing complaint:', error);
      toast.error('Failed to file complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordingToggle = () => {
    if (recording) {
      setRecording(false);
      setTimeout(() => {
        setRecordingData("I visited the local municipal office for a building permit, and the clerk demanded ₹5000 to process the application, saying it would otherwise be delayed by months.");
        setValue('description', "I visited the local municipal office for a building permit, and the clerk demanded ₹5000 to process the application, saying it would otherwise be delayed by months.");
      }, 1000);
    } else {
      setRecording(true);
      setRecordingData(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">File a Corruption Complaint</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Complaint Title *
                  </label>
                  <input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className={`mt-1 block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Preferred Language
                  </label>
                  <select
                    id="language"
                    {...register('language')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                    <option value="bengali">বাংলা (Bengali)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="malayalam">മലയാളം (Malayalam)</option>
                    <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="odia">ଓଡ଼ିଆ (Odia)</option>
                    <option value="urdu">اردو (Urdu)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Complaint Description *
                    </label>
                    <button
                      type="button"
                      onClick={handleRecordingToggle}
                      className={`inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-full ${
                        recording
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {recording ? (
                        <>
                          <span className="mr-1">Recording...</span>
                          <X className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <Mic className="h-3 w-3 mr-1" />
                          Voice Input
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    id="description"
                    rows={6}
                    {...register('description', { required: 'Description is required' })}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.description
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } sm:text-sm`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                  )}
                  {recordingData && (
                    <div className="mt-2 text-xs text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Voice transcription complete
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Corruption Category *
                    </label>
                    <select
                      id="category"
                      {...register('category', { required: 'Category is required' })}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                        errors.category
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } sm:text-sm rounded-md`}
                    >
                      <option value="">Select a category</option>
                      <option value="Bribery">Bribery</option>
                      <option value="Extortion">Extortion</option>
                      <option value="Embezzlement">Embezzlement</option>
                      <option value="Nepotism">Nepotism</option>
                      <option value="Tender Fraud">Tender Fraud</option>
                      <option value="Abuse of Power">Abuse of Power</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Government Department *
                    </label>
                    <select
                      id="department"
                      {...register('department', { required: 'Department is required' })}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                        errors.department
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } sm:text-sm rounded-md`}
                    >
                      <option value="">Select a department</option>
                      <option value="Police">Police</option>
                      <option value="Municipal Corporation">Municipal Corporation</option>
                      <option value="Electricity Board">Electricity Board</option>
                      <option value="Revenue Department">Revenue Department</option>
                      <option value="Public Works Department">Public Works Department</option>
                      <option value="Health Department">Health Department</option>
                      <option value="Education Department">Education Department</option>
                      <option value="Transport Department">Transport Department</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.department && (
                      <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      id="location"
                      {...register('location', { required: 'Location is required' })}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.location
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } sm:text-sm`}
                      placeholder="e.g., Delhi, Mumbai, Chennai"
                    />
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence (Photos, Documents, Audio)
                  </label>

                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF, MP3 up to 10MB each
                      </p>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between py-2 px-3 text-sm bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FilePlus className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-900 font-medium">{file.name}</span>
                            <span className="ml-2 text-gray-500 text-xs">{(file.size / 1024).toFixed(0)} KB</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="anonymous"
                    type="checkbox"
                    {...register('anonymous')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    File this complaint anonymously
                  </label>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your complaint will be recorded on a secure, immutable ledger. All submissions are encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Complaint'
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileComplaint;