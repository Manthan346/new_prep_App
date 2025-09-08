import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  User, 
  Mail, 
  Hash,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AllJobsAndApplicants = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applicants'
  const [expandedJobs, setExpandedJobs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { error, success } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await announcementsAPI.getAllJobsAndApplicants();
      if (response.data?.success) {
        setData(response.data);
        return;
      }
      error('Failed', response.data?.message || 'Failed to load jobs and applicants data');
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Failed to load jobs and applicants data';
      if (status === 401) {
        error('Unauthorized', 'Please log in to view this page.');
      } else if (status === 403) {
        error('Forbidden', 'Admin access required to view jobs and applicants.');
      } else if (status === 404) {
        error('Not Found', 'Endpoint not found on server.');
      } else {
        error('Error', msg);
      }
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobExpansion = (jobId) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const filteredJobs = data?.jobAnnouncements?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredApplicants = data?.allApplicants?.filter(applicant =>
    applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading jobs and applicants..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">All Jobs & Applicants</h2>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-900">{data.totalJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Applicants</p>
                <p className="text-2xl font-bold text-green-900">{data.totalApplicants}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Active Applications</p>
                <p className="text-2xl font-bold text-purple-900">
                  {data.jobAnnouncements?.reduce((sum, job) => sum + job.applicantCount, 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs or applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jobs ({filteredJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'applicants'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Applicants ({filteredApplicants.length})
            </button>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No jobs match your search' : 'No job announcements found'}
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {job.applicantCount} applicants
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Created by: {job.createdBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleJobExpansion(job._id)}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedJobs.has(job._id) ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Expanded Applicants List */}
                  {expandedJobs.has(job._id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Applicants ({job.applicants.length})
                      </h4>
                      {job.applicants.length === 0 ? (
                        <p className="text-sm text-gray-500">No applicants yet</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {job.applicants.map((applicant) => (
                            <div key={applicant._id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  {applicant.name || 'Unknown User'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span>{applicant.email || 'No email'}</span>
                              </div>
                              {applicant.rollNumber && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <Hash className="h-3 w-3" />
                                  <span>Roll: {applicant.rollNumber}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {filteredApplicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No applicants match your search' : 'No applicants found'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApplicants.map((applicant) => (
                  <div key={applicant._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {applicant.name || 'Unknown User'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Joined: {formatDate(applicant.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{applicant.email || 'No email'}</span>
                      </div>
                      {applicant.rollNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Hash className="h-4 w-4" />
                          <span>Roll: {applicant.rollNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllJobsAndApplicants;
