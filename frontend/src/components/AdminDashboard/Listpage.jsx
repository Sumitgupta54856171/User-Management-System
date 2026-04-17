import  { useState } from 'react';

const ReusableTable = ({ 
  data, 
  isActivityLog = false, 
  onEdit, 
  onDelete 
}) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Updated At</th>
              {/* Actions column tabhi dikhega jab isActivityLog false ho */}
              {!isActivityLog && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {currentData.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${item.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                      item.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {item.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                
                {/* Actions Buttons */}
                {!isActivityLog && (
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => onEdit(item)} 
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(item._id)} 
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
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
  );
};

export default ReusableTable;