import { useState } from 'react';

const ActivityLog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Proper activity log data
  const activities = [
    {
      _id: '101',
      user: 'Admin User',
      action: 'Created new user',
      target: 'John Doe',
      timestamp: '2024-04-17T10:30:00Z',
      description: 'Admin created new user account for John Doe'
    },
    {
      _id: '102',
      user: 'Manager User',
      action: 'Updated profile',
      target: 'Jane Smith',
      timestamp: '2024-04-17T09:15:00Z',
      description: 'Manager updated Jane Smith\'s profile information'
    },
    {
      _id: '103',
      user: 'Admin User',
      action: 'Deleted user',
      target: 'Old User',
      timestamp: '2024-04-16T15:45:00Z',
      description: 'Admin deleted user account: Old User'
    },
    {
      _id: '104',
      user: 'System',
      action: 'Auto backup',
      target: 'Database',
      timestamp: '2024-04-16T12:00:00Z',
      description: 'System performed automatic database backup'
    },
    {
      _id: '105',
      user: 'Manager User',
      action: 'Changed role',
      target: 'Mike Wilson',
      timestamp: '2024-04-16T08:30:00Z',
      description: 'Manager changed Mike Wilson\'s role from User to Manager'
    },
    {
      _id: '106',
      user: 'Admin User',
      action: 'Login attempt',
      target: 'System',
      timestamp: '2024-04-15T18:20:00Z',
      description: 'Admin successfully logged into the system'
    },
    {
      _id: '107',
      user: 'User Account',
      action: 'Password reset',
      target: 'Sarah Johnson',
      timestamp: '2024-04-15T14:10:00Z',
      description: 'Password reset request for Sarah Johnson was completed'
    },
    {
      _id: '108',
      user: 'Manager User',
      action: 'Viewed reports',
      target: 'Analytics',
      timestamp: '2024-04-15T11:25:00Z',
      description: 'Manager accessed system analytics and reports'
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = activities.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'created':
      case 'added':
        return 'bg-green-100 text-green-700';
      case 'updated':
      case 'changed':
      case 'modified':
        return 'bg-blue-100 text-blue-700';
      case 'deleted':
      case 'removed':
        return 'bg-red-100 text-red-700';
      case 'login':
      case 'accessed':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Activity Logs</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Showing recent system activities</span>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {currentData.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.user === 'System' ? 'bg-gray-400' : 'bg-blue-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{activity.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{activity.target}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={activity.description}>
                      {activity.description}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(activity.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 gap-4">
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, activities.length)} of {activities.length} activities
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-gray-500">No activity logs found.</p>
            <p className="text-sm text-gray-400 mt-2">System activities will appear here once users start interacting with the system.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;