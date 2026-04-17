import ReusableTable from '../AdminDashboard/Listpage';

const ActivityLog = () => {
  // Dummy data with proper structure
  const activities = [
    { _id: '101', name: 'Marcus Sterling', role: 'Admin', createdAt: '2024-04-16T10:30:00Z', updatedAt: '2024-04-16T10:30:00Z' },
    { _id: '102', name: 'System Auto-Update', role: 'Manager', createdAt: '2024-04-17T09:15:00Z', updatedAt: '2024-04-17T09:15:00Z' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      {/* Bas isActivityLog={true} laga do, baaki table khud handle kar lega */}
      {activities.length > 0 ? (
        <ReusableTable 
          data={activities} 
          isActivityLog={true} 
          onEdit={undefined}
          onDelete={undefined}
        />
      ) : (
        <p>No activity logs found.</p>
      )}
    </div>
  );
};

export default ActivityLog;