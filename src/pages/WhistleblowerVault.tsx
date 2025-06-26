import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileLock, Shield, Lock, Eye, Upload, AlertTriangle, Key, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type WhistleblowerForm = {
  title: string;
  description: string;
  department: string;
  location: string;
  evidence: FileList | null;
};

const WhistleblowerVault: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WhistleblowerForm>();
  
  const onSubmit = async (data: WhistleblowerForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate encryption and submission process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock encryption key
      const key = `vg-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
      setEncryptionKey(key);
      
      toast.success('Evidence successfully encrypted and submitted to secure vault!');
      reset();
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error submitting evidence:', error);
      toast.error('Failed to submit evidence. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <div className="bg-blue-900 px-6 py-4">
            <div className="flex items-center">
              <FileLock className="h-6 w-6 text-white" />
              <h1 className="ml-2 text-xl font-bold text-white">Anonymous Whistleblower Vault</h1>
            </div>
            <p className="mt-1 text-sm text-blue-200">
              Securely submit sensitive evidence with enhanced privacy protections
            </p>
          </div>
          
          <div className="px-6 py-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Security Information
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      All submissions are end-to-end encrypted. Your identity is protected by:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>IP anonymization</li>
                      <li>Metadata stripping from all uploaded files</li>
                      <li>Secure, encrypted storage on an immutable blockchain</li>
                      <li>Access controls requiring multiple authorized officials for decryption</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {encryptionKey ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-green-300 bg-green-50 rounded-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <Key className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="ml-2 text-lg font-medium text-green-800">
                    Evidence Successfully Submitted
                  </h2>
                </div>
                <p className="text-green-700 mb-4">
                  Your evidence has been encrypted and securely stored. Please save the following key to track your submission:
                </p>
                <div className="bg-white border border-green-200 rounded-md p-3 font-mono text-sm mb-4">
                  {encryptionKey}
                </div>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-2 text-sm text-green-700">
                    <strong>Important:</strong> This key will only be shown once. Please save it in a secure location.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEncryptionKey(null);
                    reset();
                  }}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Another Report
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Report Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className={`mt-1 block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Detailed Description *
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      {...register('description', { required: 'Description is required' })}
                      className={`mt-1 block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                      placeholder="Provide detailed information about the corruption incident. Include names, dates, locations, and specific actions."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department/Entity Involved *
                      </label>
                      <input
                        id="department"
                        type="text"
                        {...register('department', { required: 'Department is required' })}
                        className={`mt-1 block w-full rounded-md shadow-sm ${errors.department ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                      />
                      {errors.department && (
                        <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location *
                      </label>
                      <input
                        id="location"
                        type="text"
                        {...register('location', { required: 'Location is required' })}
                        className={`mt-1 block w-full rounded-md shadow-sm ${errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} sm:text-sm`}
                      />
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidence Files (Documents, Photos, Audio)
                    </label>
                    
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload evidence files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Files will be automatically encrypted during upload
                        </p>
                      </div>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <ul className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-md">
                        {uploadedFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                            <div className="flex items-center flex-1 w-0">
                              <Lock className="flex-shrink-0 h-5 w-5 text-gray-400" />
                              <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex items-center space-x-3">
                              <span className="text-green-600 text-xs">Ready to encrypt</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Privacy Protection
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc space-y-1 pl-5">
                            <li>Your IP address will not be logged</li>
                            <li>All document metadata will be stripped</li>
                            <li>End-to-end encryption protects your identity</li>
                            <li>Evidence is stored on a secure blockchain</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
                        Encrypting & Submitting...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Submit Securely to Whistleblower Vault
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhistleblowerVault;